import { usePricingPlans } from '@/hooks/useSupabaseData'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { PlanSelector } from '@/components/PlanSelector'

export function Pricing() {
  const { data: plans, isLoading, error } = usePricingPlans()

  if (isLoading) {
    return (
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-8">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-10 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-6" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full mt-8" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <p className="text-destructive">Failed to load pricing plans</p>
        </div>
      </section>
    )
  }

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, Transparent{' '}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your team. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans?.map((plan, index) => (
            <div 
              key={plan.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <PlanSelector plan={plan} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in delay-700">
          <p className="text-muted-foreground mb-4">
            Need a custom solution? 
            <a href="#contact" className="text-primary hover:underline ml-1">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}