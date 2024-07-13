"use server";

import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getUser } from "@/lib/user";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import axios from "axios";
import { $Enums } from "@prisma/client";

export async function approvedRequest(documentRequestId: string) {
  try {
    const user = await getUser();

    if (user?.role === "User") {
      throw new Error("Something went wrong");
    }

    await db.$transaction(async (tx) => {
      const documentRequest = await tx.documentRequest.update({
        where: {
          id: documentRequestId,
        },
        data: {
          status: "Approved",
          issuedById: user?.id,
          dateIssued: new Date(),
        },
        include: {
          requestedBy: {
            select: {
              fullName: true,
              email: true,
              mobile: true,
            },
          },
        },
      });

      const notification = await tx.notification.create({
        data: {
          userId: documentRequest.requestedById,
          message: `<strong>${documentRequest.requestedBy.fullName}</strong>, your document request for <strong>${documentRequest.documentType}</strong> has been approved`,
          path: `/user/my-request?id=${documentRequest.id}`,
          notificationFor: "User",
        },
        include: {
          markAllAsRead: true,
        },
      });

      await pusherServer.trigger(
        documentRequest.requestedById,
        "user:notification",
        notification
      );

      await sendEmailNotification(
        documentRequest.requestedBy.email,
        documentRequest.requestedBy.fullName,
        documentRequest.purposes,
        documentRequest.documentType,
        documentRequest.status
      );

      await sendPhoneNotification(
        documentRequest.requestedBy.mobile,
        documentRequest.requestedBy.fullName,
        documentRequest.purposes,
        documentRequest.documentType,
        documentRequest.status
      );
    });

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function disapprovedRequestAction(
  documentRequestId: string | undefined,
  formData: FormData
) {
  const reasonForDisapproval = formData.get("reasonForDisapproval") as string;

  if (!reasonForDisapproval) {
    throw new Error("Something went wrong");
  }

  await db.$transaction(async (tx) => {
    const documentRequest = await db.documentRequest.update({
      where: {
        id: documentRequestId,
      },
      data: {
        reasonForDisapproval,
        status: "Disapproved",
      },
      include: {
        requestedBy: {
          select: {
            fullName: true,
            email: true,
            mobile: true,
          },
        },
      },
    });

    const notification = await tx.notification.create({
      data: {
        userId: documentRequest.requestedById,
        message: `<strong>${documentRequest.requestedBy.fullName}</strong>, your document request for <strong>${documentRequest.documentType}</strong> has been disapproved`,
        path: `/user/my-request?id=${documentRequest.id}`,
        notificationFor: "User",
      },
      include: {
        markAllAsRead: true,
      },
    });

    await pusherServer.trigger(
      documentRequest.requestedById,
      "user:notification",
      notification
    );

    await sendEmailNotification(
      documentRequest.requestedBy.email,
      documentRequest.requestedBy.fullName,
      documentRequest.purposes,
      documentRequest.documentType,
      documentRequest.status,
      documentRequest.reasonForDisapproval
    );

    await sendPhoneNotification(
      documentRequest.requestedBy.mobile,
      documentRequest.requestedBy.fullName,
      documentRequest.purposes,
      documentRequest.documentType,
      documentRequest.status,
      documentRequest.reasonForDisapproval
    );
  });

  revalidatePath("/");
}

// email
const sendEmailNotification = async (
  toEmail: string,
  fullName: string,
  purposes: string,
  documentType: string,
  status: $Enums.DocumentRequestStatus,
  reasonForDisapproval?: string | null
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: toEmail,
    subject: "Barangay Document Request",
    html: renderEmailTemplate(
      fullName,
      purposes,
      documentType,
      status,
      reasonForDisapproval
    ),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const renderEmailTemplate = (
  fullName: string,
  purposes: string,
  documentType: string,
  status: $Enums.DocumentRequestStatus,
  reasonForDisapproval?: string | null
) => {
  return `
    <div style="font-size: 14px; padding: 1rem; border-top: 1px solid gray; color: rgb(93, 93, 93);">
      <p>Dear ${fullName}</p>
      <p>I hope you're having a good day.</p>
      <p style="line-height: 25px;">
        I am pleased to inform you that your request for a <strong style="color: black;">${documentType}</strong> has been <span style="color: ${
    status === "Approved" ? "green" : "red"
  };">${status}</span>.</p>
        
      <ul>
        <li style="margin-top: 15px;"><strong style="color: black;">Name:</strong> ${fullName}</li>
        <li style="margin-top: 15px;"><strong style="color: black;">Purposes:</strong> ${purposes}</li>
      </ul>

      ${
        status === "Approved"
          ? `<p style="line-height: 25px;">You may now claim your’e <strong style="color: black;">${documentType}</strong> at Banaba East Barangay Hall</p>`
          : `${reasonForDisapproval}`
      }

      <p style="line-height: 25px;">Barangay hall is open on weekdays from 7am to 5pm.</p>

      <p>If you have any questions or need further assistance, please do not hesitate to contact us:</p>

      <ul>
        <li style="margin-top: 15px;">${process.env.MY_EMAIL}</li>
      </ul>

      <div style="margin-top: 2rem; display: flex; justify-content: center">
        <a href="${
          process.env.MAIN_BASE_URL
        }/user/my-request" style="background-color: green; color: white; padding: 1rem; border-radius: 1000px; margin-left: auto; margin-right: auto;">See more</a>
      </div>

      <div style="margin-top: 60px;">
        <p>Thank you for your cooperation.</p>
        <p>Best regards.</p>
      </div>
    </div> 
  `;
};

// Phone number
const sendPhoneNotification = async (
  toPhonenumber: string | null,
  fullName: string,
  purposes: string,
  documentType: string,
  status: $Enums.DocumentRequestStatus,
  reasonForDisapproval?: string | null
) => {
  const E164FORMAT = `+63${toPhonenumber?.slice(1)}`;

  await axios
    .post("https://textbelt.com/text", {
      phone: E164FORMAT,
      message: renderPhoneTemplate(fullName, purposes, documentType),
      key: process.env.TEXT_BELT_API_KEY,
      sender: "Barangay Banaba",
    })
    .then((res) => console.log(res.data, E164FORMAT))
    .catch((err) => console.log(err));
};

const renderPhoneTemplate = (
  fullName: string,
  purposes: string,
  documentType: string
) => {
  return `
    Dear ${fullName}\n
    I hope you're having a good day. \n
    I am pleased to inform you that your request for a Barangay Clearance has been approved.\n\n

    Name: ${fullName} \n
    purpose: ${purposes} \n\n
    
    you may now claim your’e ${documentType} at Banaba East Barangay Hall. \n
    Barangay hall is open on weekdays from 7am to 5pm. \n
    If you have any questions or need further assistance, please do not hesitate to contact us: \n
   
    Thank you for your cooperation.\n
    Best regards,
  `;
};
