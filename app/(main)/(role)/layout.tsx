import { Wrapper } from "@/components/wrapper";
import React, { ReactNode } from "react";

const RoleLayout = ({ children }: { children: ReactNode }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default RoleLayout;
