import { Button, Flex, LoadingOverlay, Select, TextInput } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useNavigation, useResource } from "@refinedev/core"
import { IconEdit, IconList, IconRefresh } from "@tabler/icons"
import { useEffect, useState } from "react"
import * as yup from "yup"
import { useCreateSkill } from "../../hooks/mutations/useCreateSkill"
import { useUpdateSkill } from "../../hooks/mutations/useUpdateSkill"
import { useSearchCompaniesByName } from "../../hooks/queries/useSearchCompaniesByName"
import useOne from "../../hooks/useOne"
import { useForm } from "../../hooks/useForm"

const schema = yup.object({
  prefLabel: yup.array().of(
    yup.object().shape({
      value: yup
        .string()
        .required("Skill Title is required")
        .max(50, "Skill Title must be at most 50 characters")
    })
  ),
  description: yup.array().of(
    yup.object().shape({
      value: yup
        .string()
        .required("Skill Description is required")
        .max(200, "Skill Description must be at most 200 characters")
    })
  ),
  company: yup
    .array()
    .of(yup.string().required("Linked company is required"))
    .min(1, "Must be linked to 1 company")
    .max(1, "Must be linked to 1 company")
})

const defaultValues = {
  prefLabel: [{ value: "" }],
  description: [{ value: "" }],
  company: []
}

const skillTypes = {
  "1": "Hard skill",
  "2": "Soft skill",
  "3": "Cross-functional skill",
  "4": "System skill",
  "5": "Others"
}

const disabledStyle = {
  backgroundColor: "#fff",
  color: "#000",
  opacity: 1
}

const SkillDetailForm = () => {
  const { id, action } = useResource()
  const isViewOnly = action === "show"
  const { data, refetch, isLoading } = useOne({
    id: id as string
  })
  const [companySearchText, setCompanySearchText] = useState("")
  const [debouncedCompanySearchText] = useDebouncedValue(companySearchText, 200)
  const { companies, isLoading: isSearchingCompanies } =
    useSearchCompaniesByName(debouncedCompanySearchText)
  const [rawData, setRawData] = useState<any>(defaultValues)
  const { edit, list, show } = useNavigation()
  const {
    getFieldState,
    formState,
    reset,
    getValues,
    handleSubmit,
    watch,
    isDirty,
    handleChange
  } = useForm({
    defaultValues: rawData,
    yupSchema: schema,
    isViewOnly
  })
  const { mutate: createSkill } = useCreateSkill()
  const { mutate: updateSkill } = useUpdateSkill(id as string)

  const onSubmit = async (values: any) => {
    if (!formState.isValid || formState.isSubmitting || !isDirty) return
    if (!values.company?.length) return
    if (!id) {
      const { id: newSkillId } = await createSkill(values, values.company[0])
      notifications.show({
        message: "Skill created successfully",
        color: "green"
      })
      edit("skills", newSkillId)
    } else {
      const { company, ..._values } = values
      await updateSkill(_values)
      notifications.show({
        message: "Skill updated successfully",
        color: "green"
      })
    }
    refetch()
  }

  useEffect(() => {
    if (data) {
      const raw = {
        ...data,
        company: data.company?.map((c: any) => c.id) ?? []
      }
      setRawData(raw)
      setCompanySearchText(data.company?.[0]?.companyName?.[0]?.value ?? "")
      reset(raw)
    }
  }, [data])

  const values = watch()
  console.log("values: ", values)
  // console.log("formState.isDirty: ", formState.isDirty)

  return (
    <div>
      <Flex justify="space-between">
        <h1>Skill Detail</h1>
        <Flex gap={8}>
          <Button
            onClick={() => list("jobs")}
            leftSection={<IconList />}
            variant="outline"
          >
            Skills
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
          value={getValues("prefLabel.0.value")}
          label="Title"
          required
          error={getFieldState("prefLabel.0.value")?.error?.message}
          onChange={(e) => handleChange("prefLabel.0.value", e.target.value)}
          disabled={isViewOnly}
          styles={{ input: isViewOnly ? disabledStyle : {} }}
        />
        <TextInput
          value={getValues("description.0.value")}
          label="Description"
          required
          error={getFieldState("description.0.value")?.error?.message}
          onChange={(e) => handleChange("description.0.value", e.target.value)}
          disabled={isViewOnly}
          styles={{ input: isViewOnly ? disabledStyle : {} }}
        />
        <Select
          required
          data={
            companies?.map((d: any) => ({
              value: d.id,
              label: d.companyName?.[0]?.value
            })) ?? []
          }
          nothingFoundMessage={
            isSearchingCompanies ? "Loading..." : "Nothing found"
          }
          label="Company"
          searchable
          searchValue={companySearchText}
          onSearchChange={(value) => setCompanySearchText(value)}
          value={getValues("company.0")}
          onChange={(value) => handleChange("company.0", value)}
          //currently should not allow to change company when editing skill
          disabled={isViewOnly || !!id}
          styles={{
            input: isViewOnly ? disabledStyle : {}
          }}
        />
        <Select
          required
          data={Object.entries(skillTypes).map(([value, label]) => ({
            value,
            label
          }))}
          label="Skill Type"
          value={getValues("skillType.0.value")}
          onChange={(value) => {
            handleChange("skillType.0.value", value)
            handleChange("skillTypeLabel.0.value", skillTypes[value])
          }}
          disabled={isViewOnly}
          styles={{
            input: isViewOnly ? disabledStyle : {}
          }}
        />
        {!isViewOnly && (
          <Button
            type="button"
            disabled={!formState.isValid || formState.isSubmitting || !isDirty}
            onClick={handleSubmit(onSubmit)}
            style={{ marginTop: 20 }}
            loading={formState.isSubmitting}
          >
            Save
          </Button>
        )}
      </form>
    </div>
  )
}

export default SkillDetailForm
