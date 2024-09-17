import { yupResolver } from "@hookform/resolvers/yup"
import {
  FieldValues,
  useForm as baseUseForm,
  UseFormProps
} from "react-hook-form"
import { ObjectSchema } from "yup"

export const useForm = <T extends FieldValues>({
  defaultValues,
  yupSchema,
  isViewOnly
}: {
  defaultValues: Record<string, any>
  yupSchema: ObjectSchema<T>
  isViewOnly?: boolean
}) => {
  const method = baseUseForm({
    defaultValues,
    resolver: yupResolver(yupSchema) as any,
    mode: "onBlur",
    reValidateMode: "onBlur",
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true
    }
  })

  const { formState, setValue } = method

  // Since we are using fields with array as values, sometimes react-hook-form isDirty is not updated
  const isDirty =
    formState.isDirty || Object.keys(formState.dirtyFields).length > 0
  const handleChange = (key: string, value: any) => {
    if (!isViewOnly) {
      setValue(key, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      })
    }
  }
  return {
    ...method,
    isDirty,
    handleChange
  }
}
