import { $, Slot, component$, useContext, useSignal } from "@builder.io/qwik"

import { Modal } from "~/components/Modal"
import { ImmersionForm } from "./components/ImmersionForm"
import { Button } from "~/components/Button"

import { currentLanguageContext } from "~/routes/dashboard"

interface AddImmersionSessionProps {
  immersionType: "active" | "passive" | "study"
  tooltip?: string
}

export const AddImmersionButton = component$<AddImmersionSessionProps>(
  ({ immersionType, tooltip }) => {
    const isFormVisible = useSignal(false)
    const language = useContext(currentLanguageContext)

    if (language.language == null) return null

    return (
      <>
        <div class="tooltip tooltip-left" data-tip={tooltip}>
          <Button
            color="neutral"
            class="normal-case btn-circle"
            type="button"
            onClick={$(() => (isFormVisible.value = true))}
          >
            <Slot />
          </Button>
        </div>
        <Modal
          onClose={$(() => (isFormVisible.value = false))}
          isVisible={isFormVisible}
        >
          <ImmersionForm
            immersionType={immersionType}
            language={language.language}
            onClose={$(() => (isFormVisible.value = false))}
          />
        </Modal>
      </>
    )
  },
)
