import { eq } from "drizzle-orm";
import z from "zod";
import DriveContents from "~/app/drive-contents";
import { db } from "~/server/db";
import {
  files as filesSchema,
  folders as folderSchema,
} from "~/server/db/schema";

type GoogleDriveCloneProps = {
  params: Promise<{ folderId: string }>;
};

export default async function GoogleDriveClone({
  params,
}: GoogleDriveCloneProps) {
  const { folderId } = await params;
  const parsedFolderId = parseInt(folderId, 10);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const files = await db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, parsedFolderId));

  const folders = await db
    .select()
    .from(folderSchema)
    .where(eq(folderSchema.parent, parsedFolderId));

  return <DriveContents files={files} folders={folders} />;
}
