import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="w-full flex pt-4 justify-center">
      <Spinner />{" "}
    </div>
  );
}
