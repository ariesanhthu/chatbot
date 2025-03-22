import { MultimodalInput } from './MultimodalInput';

interface ChatProps {
  id: string;
  isReadonly: boolean;
  messages: any[]; // You can replace `any[]` with a more specific type if available
  input: string;
  setInput: (value: string) => void;
  handleSubmit: () => void;
  isLoading: boolean;
}

export function Chat({
  id,
  isReadonly,
  messages,
  input,
  setInput,
  handleSubmit,
  isLoading,
}: ChatProps) {
  return (
    <div className="chat-container">
      {/* Other chat components like messages list */}
      <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        {!isReadonly && (
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </form>
    </div>
  );
}
