import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Input
} from "@chakra-ui/react"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { useDataProvider, useNavigation } from "@refinedev/core"

// @ts-ignore
import { useMainContext } from "@mmorg/rdfx-refine"

const LoginPage = () => {
  const { token } = useMainContext()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  })
  const { push } = useNavigation()
  const dataProvider: any = useDataProvider()
  const login = useMemo(() => {
    return dataProvider().login
  }, [])

  useEffect(() => {
    if (token) {
      push("/")
    }
  }, [token])

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Card
        sx={{
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
      >
        <form
          onSubmit={handleSubmit(async ({ username, password }) => {
            const { accessToken } = await login({ username, password })
            window.localStorage.setItem("admin-ui-token", accessToken)
            window.dispatchEvent(new StorageEvent("storage"))
          })}
        >
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input {...register("username", { required: true })} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              {...register("password", { required: true })}
            />
          </FormControl>
          <Button type="submit">Login</Button>
        </form>
      </Card>
    </Box>
  )
}

export default LoginPage
