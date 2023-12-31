import { $, component$, useSignal } from "@builder.io/qwik"
import { Button } from "~/components/Button"
import { Modal } from "~/components/Modal"
import { Select } from "~/components/Select"
// import { userDetailsContext } from "~/root"
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city"
import { supabaseServerClient } from "~/utils/supabase"

export const useGetLanguages = routeLoader$(async (requestEv) => {
  const supabaseClient = supabaseServerClient(requestEv)
  const { data, error } = await (await supabaseClient)
    .from("languages")
    .select("*")
  return { data, error }
})

export const useAddLanguage = routeAction$(async (data, requestEv) => {
  const supabaseClient = await supabaseServerClient(requestEv)
  const { data: userData } = await supabaseClient.auth.getUser()

  const { error } = await supabaseClient.from("user_languages").insert({
    user_id: userData.user?.id,
    language: data.language,
    country_code_name: data.country,
  })
  if (error) {
    console.error(error)
    return {
      error,
    }
  } else {
    return {
      success: "whoops",
    }
  }
})

export interface AddLanguageButtonProps {}

export default component$<AddLanguageButtonProps>(() => {
  const isModalVisible = useSignal(false)
  const languages = useGetLanguages()
  const selectedLanguage = useSignal("")
  const isError = useSignal(false)

  const add = useAddLanguage()

  if (languages.value.data == null) return null

  const handleSubmit = $(async () => {
    const { value } = await add.submit({
      country: selectedLanguage.value,
      language: languages.value.data?.find(
        (language) => language.country_code_name === selectedLanguage.value,
      ).lang_name,
    })
    if (value.error) {
      isError.value = true
    } else {
      isError.value = false
      isModalVisible.value = false
    }
  })

  return (
    <>
      <button
        class="btn btn-circle btn-ghost text-3xl"
        onClick$={$(() => (isModalVisible.value = true))}
      >
        +
      </button>
      <Modal
        isVisible={isModalVisible}
        onClose={$(() => (isModalVisible.value = false))}
      >
        <form preventdefault:submit onSubmit$={handleSubmit}>
          <div class="flex gap-4 w-full justify-center items-end mb-16">
            <Select
              bind={selectedLanguage}
              options={languages.value.data
                .filter((country) => country.lang_code)
                .sort((a, b) => a.lang_name.localeCompare(b.lang_name))
                .map((language) => ({
                  key: language.lang_code + language.lang_name,
                  label: `${language.lang_name} (${language.country_name})`,
                  value: language.country_code_name as string,
                }))}
              label="Select a language"
              placeholder="Select a language"
            />
            {isError.value && (
              <p class="text-red-500">You've already added that language</p>
            )}
            <Button type="submit">Add</Button>
          </div>
        </form>
      </Modal>
    </>
  )
})
