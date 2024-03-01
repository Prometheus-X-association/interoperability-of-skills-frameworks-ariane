import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Flex, LoadingOverlay, TextInput } from "@mantine/core"
import { useNavigation, useResource } from "@refinedev/core"
import { IconEdit, IconList, IconRefresh } from "@tabler/icons"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import useOne from "../../hooks/useOne"

const schema = yup.object({})

const disabledStyle = {
  backgroundColor: "#fff!important",
  color: "#000",
  opacity: 1
}

const JobDetailForm = () => {
  const { id, action } = useResource()
  const isViewOnly = action === "show"
  const { data, refetch, isLoading } = useOne({
    id: id as string
  })
  const [rawData, setRawData] = useState<any>({})
  const { edit, list } = useNavigation()
  const { formState, reset, getValues, setValue, handleSubmit, watch } =
    useForm({
      defaultValues: rawData,
      resolver: yupResolver(schema),
      mode: "onBlur",
      reValidateMode: "onBlur",
      resetOptions: {
        keepDirty: true,
        keepDirtyValues: true
      }
    })

  useEffect(() => {
    if (data) {
      setRawData(data)
      reset(data)
    }
  }, [data])

  const values = watch()
  // console.log('values: ', values)
  // console.log("formState.isDirty: ", formState.isDirty)

  return (
    <div>
      <Flex justify="space-between">
        <h1>Job Detail</h1>
        <Flex gap={8}>
          <Button
            onClick={() => list("jobs")}
            leftSection={<IconList />}
            variant="outline"
          >
            Jobs
          </Button>
          {!!id && isViewOnly && (
            <>
              <Button
                onClick={() => edit("jobs", id as string)}
                leftSection={<IconEdit />}
                variant="outline"
                color="green"
              >
                Edit
              </Button>
              <Button
                onClick={() => refetch()}
                leftSection={<IconRefresh />}
                variant="outline"
              >
                Refresh
              </Button>
            </>
          )}
        </Flex>
      </Flex>
      <form style={{ position: "relative" }}>
        <LoadingOverlay
          visible={formState.isSubmitting || isLoading}
          overlayProps={{ blur: isLoading ? 5 : 0.2 }}
        />
        <TextInput
          value={getValues("jobTitle.0.value")}
          label="Job Title"
          required
          error={
            formState.errors?.jobTitle ? "Job Title is required" : undefined
          }
          onChange={(e) =>
            !isViewOnly &&
            setValue("jobTitle.0.value", e.target.value, {
              shouldValidate: true,
              shouldDirty: true
            })
          }
          disabled={isViewOnly}
          styles={{
            input: {
              "&:disabled": disabledStyle
            }
          }}
        />
      </form>
    </div>
  )
}

export default JobDetailForm
