import {
  MultiSelect,
  Select,
  TextInput,
  Button,
  ColorInput,
  Checkbox,
  Box,
  LoadingOverlay,
  Flex,
  Title,
  List,
  Divider
} from "@mantine/core"
import { useNavigation, useResource } from "@refinedev/core"
import { IconEdit, IconList, IconRefresh } from "@tabler/icons"
import { useEffect, useState } from "react"
import { useCreateCompany } from "../../hooks/mutations/useCreateCompany"
import { useUpdateCompany } from "../../hooks/mutations/useUpdateCompany"
import { useSearchSkillsByCompany } from "../../hooks/queries/useSearchSkillsByCompany"
import { useForm } from "../../hooks/useForm"
import useOne from "../../hooks/useOne"
import * as yup from "yup"
import { notifications } from "@mantine/notifications"

const languages = [
  {
    value: "en",
    label: "English"
  },
  {
    value: "fr",
    label: "French"
  },
  {
    value: "de",
    label: "German"
  },
  {
    value: "nl",
    label: "Dutch"
  }
]

const defaultFormValues = {
  companyName: [{ value: "" }],
  companyUrl: [{ value: "" }],
  companyCode: [{ value: "" }],
  companyHubspotId: [{ value: "" }],
  logo: [{ value: "" }],
  defaultLanguage: [{ value: "" }],
  // companyLanguages: [{ value: "" }],
  primaryColor: [{ value: "" }],
  secondaryColor: [{ value: "" }],
  allowSelfAssessment: [{ value: "" }],
  allowManagerValidation: [{ value: "" }],
  enabledEndUserInterface: [{ value: "" }],
  enabledCareerPathTrainingProposal: [{ value: "" }],
  enabledInternalTraining: [{ value: "" }],
  enabledExternalTraining: [{ value: "" }],
  enabledMentoring: [{ value: "" }]
}

const schema = yup.object({
  companyName: yup.array().of(
    yup.object().shape({
      value: yup.string().required("Company Name is required")
    })
  ),
  companyUrl: yup.array().of(
    yup.object().shape({
      value: yup
        .string()
        .required("Company URL is required")
        .url("Must be a valid URL")
    })
  ),
  companyCode: yup.array().of(
    yup.object().shape({
      value: yup.string().required("Company Code is required")
    })
  ),
  companyHubspotId: yup.array().of(
    yup.object().shape({
      value: yup.string().required("Company Hubspot Id is required")
    })
  ),
  defaultLanguage: yup.array().of(
    yup.object().shape({
      value: yup.string().required("Company Default Language is required")
    })
  )
})

const disabledStyle = {
  backgroundColor: "#fff",
  color: "#000",
  opacity: 1
}
const CompanyDetailForm = () => {
  const { id, action } = useResource()
  const isViewOnly = action === "show"
  const { data, refetch, isLoading } = useOne({
    id: id as string
  })
  const { skills: companySkills } = useSearchSkillsByCompany(
    id as string,
    !!isViewOnly
  )
  const { edit, list, show } = useNavigation()
  const { mutate: createCompany } = useCreateCompany()
  const { mutate: updateCompany } = useUpdateCompany(id as string)

  const [rawData, setRawData] = useState<any>(defaultFormValues)
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

  const onSubmit = async (data: any) => {
    try {
      if (!formState.isValid || formState.isSubmitting || !isDirty) return
      if (!id) {
        const { id: newCompanyId } = await createCompany(data)
        notifications.show({
          message: "Company created successfully",
          color: "green"
        })
        edit("companies", newCompanyId)
      } else {
        await updateCompany(data)
        notifications.show({
          message: "Company updated successfully",
          color: "green"
        })
      }
      refetch()
    } catch (e: any) {
      notifications.show({
        message: e.message,
        color: "red"
      })
    }
  }

  useEffect(() => {
    if (data) {
      setRawData(data)
      reset(data)
    }
  }, [data])

  const values = watch()
  // console.log('values: ', values)
  // console.log("formState: ", formState)
  // console.log("getFieldState ", getFieldState("companyName.0.value")?.error)

  return (
    <div>
      <Flex justify="space-between">
        <h1>Company Detail</h1>
        <Flex gap={8}>
          <Button
            onClick={() => list("companies")}
            leftSection={<IconList />}
            variant="outline"
          >
            Companies
          </Button>
          {!!id && isViewOnly && (
            <>
              <Button
                onClick={() => edit("companies", id as string)}
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
          value={getValues("companyName.0.value")}
          label="Company Name"
          required
          error={getFieldState("companyName.0.value")?.error?.message}
          onChange={(e) => handleChange("companyName.0.value", e.target.value)}
          disabled={isViewOnly}
          styles={{
            input: isViewOnly ? disabledStyle : {}
          }}
        />
        <TextInput
          value={getValues("companyUrl.0.value")}
          label="Company URL"
          required
          error={getFieldState("companyUrl.0.value")?.error?.message}
          onChange={(e) => handleChange("companyUrl.0.value", e.target.value)}
          disabled={isViewOnly}
          styles={{
            input: isViewOnly ? disabledStyle : {}
          }}
        />
        <TextInput
          value={getValues("companyHubspotId.0.value")}
          label="Company Hubspot Id"
          required
          error={getFieldState("companyHubspotId.0.value")?.error?.message}
          onChange={(e) =>
            handleChange("companyHubspotId.0.value", e.target.value)
          }
          disabled={isViewOnly}
          styles={{
            input: isViewOnly ? disabledStyle : {}
          }}
        />
        <TextInput
          value={getValues("companyCode.0.value")}
          label="Company Code"
          required
          error={getFieldState("companyCode.0.value")?.error?.message}
          onChange={(e) => handleChange("companyCode.0.value", e.target.value)}
          disabled={isViewOnly}
          styles={{
            input: isViewOnly ? disabledStyle : {}
          }}
        />
        <TextInput
          value={getValues("logo.0.value")}
          label="Company Logo"
          onChange={(e) =>
            !isViewOnly && handleChange("logo.0.value", e.target.value)
          }
          disabled={isViewOnly}
          styles={{
            input: isViewOnly ? disabledStyle : {}
          }}
        />
        <Select
          data={languages}
          value={getValues("defaultLanguage.0.value")}
          label="Default Language"
          error={getFieldState("defaultLanguage.0.value")?.error?.message}
          required
          onChange={(value) => handleChange("defaultLanguage.0.value", value)}
          disabled={isViewOnly}
          styles={{
            input: isViewOnly ? disabledStyle : {}
          }}
        />
        <MultiSelect
          data={languages}
          value={getValues("companyLanguages.0.value")?.split(",") ?? []}
          label="All supported language"
          onChange={(values) =>
            handleChange("companyLanguages.0.value", values.join(","))
          }
          disabled={isViewOnly}
          styles={{
            input: isViewOnly ? disabledStyle : {}
          }}
        />
        <ColorInput
          value={getValues("primaryColor.0.value")}
          label="Primary Color"
          onChange={(value) => handleChange("primaryColor.0.value", value)}
          disabled={isViewOnly}
          styles={{
            input: isViewOnly ? disabledStyle : {}
          }}
        />
        <ColorInput
          value={getValues("secondaryColor.0.value")}
          label="Secondary Color"
          onChange={(value) => handleChange("secondaryColor.0.value", value)}
          disabled={isViewOnly}
          styles={{
            input: isViewOnly ? disabledStyle : {}
          }}
        />
        <Checkbox
          checked={
            getValues("allowSelfAssessment.0.value") === "true" ||
            getValues("allowSelfAssessment.0.value") === true
          }
          style={{ marginTop: 8 }}
          label="Allow Self Assessment"
          onChange={(value) =>
            handleChange(
              "allowSelfAssessment.0.value",
              value.target.checked.toString()
            )
          }
        />
        <Checkbox
          checked={
            getValues("allowManagerValidation.0.value") === "true" ||
            getValues("allowManagerValidation.0.value") === true
          }
          style={{ marginTop: 8 }}
          label="Allow Manager Validation"
          onChange={(value) =>
            handleChange(
              "allowManagerValidation.0.value",
              value.target.checked.toString()
            )
          }
        />
        <Checkbox
          checked={
            getValues("enabledEndUserInterface.0.value") === "true" ||
            getValues("enabledEndUserInterface.0.value") === true
          }
          style={{ marginTop: 8 }}
          label="Allow End User Interface"
          onChange={(value) =>
            handleChange(
              "enabledEndUserInterface.0.value",
              value.target.checked.toString()
            )
          }
        />
        <Checkbox
          checked={
            getValues("enabledCareerPathTrainingProposal.0.value") === "true" ||
            getValues("enabledCareerPathTrainingProposal.0.value") === true
          }
          onChange={(value) => {
            if (isViewOnly) return
            const checked = value.target.checked
            if (checked) {
              handleChange("enabledCareerPathTrainingProposal.0.value", "true")
            } else {
              handleChange("enabledCareerPathTrainingProposal.0.value", "false")
              handleChange("enabledInternalTraining.0.value", "false")
              handleChange("enabledExternalTraining.0.value", "false")
              handleChange("enabledMentoring.0.value", "false")
            }
          }}
          style={{ marginTop: 8 }}
          label="Enable Career Path Training Proposal"
        />
        {values.enabledCareerPathTrainingProposal?.[0]?.value === "true" && (
          <Box style={{ marginLeft: 12 }}>
            <Checkbox
              checked={
                getValues("enabledInternalTraining.0.value") === "true" ||
                getValues("enabledInternalTraining.0.value") === true
              }
              onChange={(value) =>
                handleChange(
                  "enabledInternalTraining.0.value",
                  value.target.checked.toString()
                )
              }
              style={{ marginTop: 8 }}
              label="Allow Internal Training"
            />
            <Checkbox
              checked={
                getValues("enabledExternalTraining.0.value") === "true" ||
                getValues("enabledExternalTraining.0.value") === true
              }
              onChange={(value) =>
                handleChange(
                  "enabledExternalTraining.0.value",
                  value.target.checked.toString()
                )
              }
              style={{ marginTop: 8 }}
              label="Allow External Training"
            />
            <Checkbox
              checked={
                getValues("enabledMentoring.0.value") === "true" ||
                getValues("enabledMentoring.0.value") === true
              }
              onChange={(value) =>
                handleChange(
                  "enabledMentoring.0.value",
                  value.target.checked.toString()
                )
              }
              style={{ marginTop: 8 }}
              label="Allow Mentoring"
            />
          </Box>
        )}
        {!isViewOnly ? (
          <Flex gap={8}>
            <Button
              type="button"
              disabled={
                !formState.isValid || formState.isSubmitting || !isDirty
              }
              onClick={handleSubmit(onSubmit)}
              style={{ marginTop: 20 }}
              loading={formState.isSubmitting}
            >
              Save
            </Button>
            <Button
              type="button"
              onClick={() => (!id ? list("companies") : show("companies", id))}
              style={{ marginTop: 20 }}
              loading={formState.isSubmitting}
            >
              Cancel
            </Button>
          </Flex>
        ) : (
          <>
            {companySkills?.length > 0 && (
              <>
                <Divider my="md" />
                <Title order={6}>Skills</Title>
                <List>
                  {companySkills?.map((skill: any) => (
                    <List.Item key={skill.id}>
                      {skill.prefLabel?.[0]?.value}
                    </List.Item>
                  ))}
                </List>
              </>
            )}
          </>
        )}
      </form>
    </div>
  )
}

export default CompanyDetailForm
