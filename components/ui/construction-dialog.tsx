import { TriangleAlert } from "lucide-react";

const constructionDialog = () => {
  return (
    <div className="bg-background px-6 py-8 rounded-lg border border-border flex flex-col items-center justify-center gap-5 max-w-[340px] text-center mx-auto">
      <span className="inline-block p-4 rounded-full bg-secondary text-secondary-foreground ">
        <TriangleAlert className="size-7 " />
      </span>
      <p className="text-lg text-foreground-2">Page Under Construction </p>
      <p className="text-xs font-roboto uppercase">Please Visit Later</p>
    </div>
  );
};

export default constructionDialog;
