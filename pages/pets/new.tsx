import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"

import AdminLayout from "app/core/layouts/AdminLayout"

import {
  modelString,
  modelRouteHelpers,
  modelSchema,
  modelMutations,
  modelQueries,
  modelValidators,
} from "app/pets/components/petHelpers"
import ItemForm, { FORM_ERROR } from "app/pets/components/PetForm"

const NewPetPage = () => {
  const router = useRouter()
  const [createMutation] = useMutation(modelMutations.createItem)

  return (
    <AdminLayout title={`Create New ${modelString.Name}`}>
      <ItemForm
        submitText="Create"
        schema={modelValidators.create}
        onSubmit={async (values) => {
          try {
            const item = await createMutation(values)
            router.push(modelRouteHelpers.getShowRoute(item.id))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </AdminLayout>
  )
}

NewPetPage.authenticate = true

export default NewPetPage
