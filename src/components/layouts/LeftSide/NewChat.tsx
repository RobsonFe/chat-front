import { newChatSchema, NewChatSchema } from "@/lib/schemas/chatSchema"
import { useChatStore } from "@/stores/chatStore"
import { Form, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createChat } from "@/lib/requests"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export const NewChat = () => {
  const { setChat, showNewChat, setShowNewChat } = useChatStore()

  const form = useForm<NewChatSchema>({
    resolver: zodResolver(newChatSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: NewChatSchema) => {
    const response = await createChat(data)

    if ("error" in response) {
      toast.error(response.error.message, { position: "top-right" })
      return
    }

    if ("result" in response) {
      setChat(response.result)
      setShowNewChat(false)
      form.setValue("email", "")
    }
  }

  return (
    <Drawer open={showNewChat} onOpenChange={setShowNewChat}>
      <DrawerContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-lg"
          >
            <DrawerHeader>
              <DrawerTitle>Nova Conversa</DrawerTitle>
              <DrawerDescription>
                Insira o email do usuário para iniciar uma nova conversa.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: usuario@exemplo.com" />
                    </FormControl>
                    <FormMessage about={field.name} />
                  </FormItem>
                )}
              />
            </div>
            <DrawerFooter className="mt-8">
              <Button>Iniciar Conversa</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
