import BillingPage from "@/components/billing"

export default function Billing() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">This is your billing section. You can pay as Cash, Card or Online Banking</h1>
      <BillingPage />
    </div>
  )
}