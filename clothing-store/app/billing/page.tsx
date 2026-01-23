import Billing from "@/components/billing";

export default function BillingPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Billing Section (Cash & eSewa Payment)
      </h1>
      <Billing />
    </div>
  );
}
