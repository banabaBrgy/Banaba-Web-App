import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function ServicesPage() {
  return (
    <div className="px-4 py-4">
      <h1 className="text-lg uppercase">Services</h1>

      <form className="mt-4 space-y-4">
        <div className="space-y-2">
          <label htmlFor="document" className="text-sm">
            Document
          </label>
          <select
            id="document"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Choose Document</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="Purposes" className="text-sm">
            Purposes
          </label>
          <Textarea rows={10} placeholder="Enter purposes" />
        </div>

        <Button className="w-full bg-gradient-to-tr from-green-600 via-green-500 to-green-400 uppercase">
          Submit
        </Button>
      </form>
    </div>
  );
}
