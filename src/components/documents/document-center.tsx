"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2, Paperclip, Upload } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchDocuments,
  fetchDocumentViewUrl,
  uploadDocument,
  type UserDocument,
} from "@/lib/api-client";

type DocumentCenterProps = {
  isEnabled: boolean;
};

const ACCEPTED_TYPES = ".pdf,.doc,.docx,image/*";

const formatFileSize = (bytes: number): string => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

const statusVariant: Record<UserDocument["status"], "default" | "secondary" | "destructive"> = {
  UPLOADED: "secondary",
  PROCESSING: "secondary",
  COMPLETE: "default",
  FAILED: "destructive",
};

export function DocumentCenter({ isEnabled }: DocumentCenterProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const [viewingDocumentId, setViewingDocumentId] = useState<string | null>(null);
  const [viewError, setViewError] = useState<string | null>(null);

  const documentsQuery = useQuery<UserDocument[]>({
    queryKey: ["documents"],
    queryFn: () => fetchDocuments(),
    enabled: isEnabled,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadDocument(file),
    onSuccess: (uploadedDocument) => {
      queryClient.setQueryData<UserDocument[]>(["documents"], (prev) => [
        uploadedDocument,
        ...((prev ?? []).filter((entry) => entry.id !== uploadedDocument.id)),
      ]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const uploadError = uploadMutation.error instanceof Error ? uploadMutation.error.message : undefined;

  const viewMutation = useMutation({
    mutationFn: (documentId: string) => fetchDocumentViewUrl(documentId),
    onMutate: (documentId) => {
      setViewError(null);
      setViewingDocumentId(documentId);
    },
    onSuccess: ({ url }) => {
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      setViewError("Document is not available yet. Try again soon.");
    },
    onError: (error) => {
      setViewError(error instanceof Error ? error.message : "Unable to open document");
    },
    onSettled: () => {
      setViewingDocumentId(null);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate(file);
    event.target.value = "";
  };

  const triggerPicker = () => inputRef.current?.click();

  return (
    <Card className="border-muted">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Home Journal Documents
        </CardTitle>
        <CardDescription>
          Upload inspection reports, receipts, or appliance manuals. Documents are stored securely in HavenMind’s S3 bucket for later processing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/60 p-3">
          <div className="flex flex-1 items-center gap-2 text-sm text-muted-foreground">
            <Paperclip className="h-4 w-4 text-primary" />
            Accepted: PDF, DOC/DOCX, and common images
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={ACCEPTED_TYPES}
            onChange={handleFileSelect}
            disabled={!isEnabled || uploadMutation.isPending}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={triggerPicker}
            disabled={!isEnabled || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Upload document
              </>
            )}
          </Button>
        </div>

        {!isEnabled ? (
          <p className="text-sm text-muted-foreground">
            Connect the HavenMind API to enable uploads.
          </p>
        ) : (
          <ScrollArea className="max-h-80 rounded-lg border bg-background">
            <div className="divide-y">
              {documentsQuery.isPending && (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading documents…
                </div>
              )}

              {!documentsQuery.isPending && (documentsQuery.data?.length ?? 0) === 0 && (
                <div className="px-4 py-6 text-sm text-muted-foreground">
                  Uploaded documents will appear here once sync completes.
                </div>
              )}

              {(documentsQuery.data ?? []).map((document) => (
                <div key={document.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm sm:flex-nowrap sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{document.originalName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(document.size)} • {new Date(document.createdAt).toLocaleString()} • {document.mimeType}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant[document.status]} className="whitespace-nowrap text-xs">
                      {document.status.toLowerCase()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => viewMutation.mutate(document.id)}
                      disabled={
                        !isEnabled ||
                        (viewMutation.isPending && viewingDocumentId === document.id)
                      }
                    >
                      {viewMutation.isPending && viewingDocumentId === document.id ? (
                        <>
                          <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                          Opening…
                        </>
                      ) : (
                        "View"
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {documentsQuery.isError && (
          <p className="text-sm text-destructive">Unable to load documents right now.</p>
        )}

        {uploadError && (
          <p className="text-sm text-destructive">{uploadError}</p>
        )}

        {viewError && (
          <p className="text-sm text-destructive">{viewError}</p>
        )}
      </CardContent>
    </Card>
  );
}
