import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-red-600">Access Denied</h1>
          <p className="mb-6 text-gray-600">
            You don't have permission to access this page. Please contact your
            administrator if you believe this is a mistake.
          </p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 