function Button({ step, increment }: { step: number, increment: (step: number) => void }) {
  return (
    <button
      onClick={() => {
        increment(step)
      }}>
      +{step}
    </button>
  )
}

export default Button