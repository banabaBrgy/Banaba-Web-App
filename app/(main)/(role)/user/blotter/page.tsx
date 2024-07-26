import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import React from "react";
import BlotterForm from "./_components/blotter-form";
import CreatedBlotterTable from "./_components/created-blotter-table";
import { getCreatedBlotters } from "@/lib/query/user/blotter";
import { getUser } from "@/lib/user";

export async function generateMetadata() {
  return {
    title: "Blotter",
  };
}

export default async function BlotterPage() {
  const user = await getUser();
  const createdBlotters = await getCreatedBlotters();

  return (
    <div className="md:px-4 px-3 py-4">
      <Tabs defaultValue="create">
        <TabsList className="w-full">
          <TabsTrigger value="create" className="w-full">
            Create blotter
          </TabsTrigger>
          <TabsTrigger value="created" className="w-full">
            Created blotter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg uppercase">
                Blotter Information Form
              </CardTitle>
              <CardDescription>
                Fill all information to submit your blotter
              </CardDescription>
            </CardHeader>

            <CardContent>
              <BlotterForm user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="created">
          <CreatedBlotterTable createdBlotters={createdBlotters} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
