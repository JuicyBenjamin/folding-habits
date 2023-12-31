import type { QRL } from "@builder.io/qwik"
import { Slot, component$, $ } from "@builder.io/qwik"

interface ButtonProps {
  class?: string
  type?: "button" | "submit" | "reset"
  color?: "primary" | "secondary" | "accent" | "ghost" | "link" | "neutral"
  isLoading?: boolean
  disabled?: boolean
  onClick?: QRL
}

export const Button = component$<ButtonProps>(
  ({
    class: className,
    type = "button",
    color = "primary",
    isLoading = false,
    onClick,
  }) => {
    // TODO: Add disabled state using CVA

    const btnColor =
      color === "primary"
        ? "btn-primary"
        : color === "secondary"
        ? "btn-secondary"
        : color === "accent"
        ? "btn-accent"
        : color === "ghost"
        ? "btn-ghost"
        : color === "link"
        ? "btn-link"
        : "btn-neutral"
    return (
      <button
        disabled={isLoading}
        type={type}
        class={`btn ${btnColor} ${className}`}
        onClick$={$(() => (onClick ? onClick() : null))}
      >
        {isLoading ? (
          <span class="loading loading-spinner text-neutral" />
        ) : (
          <Slot />
        )}
      </button>
    )
  },
)
