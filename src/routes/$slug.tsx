import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  const {slug} = Route.useParams()
  return <div>Hello {slug}!</div>
}
