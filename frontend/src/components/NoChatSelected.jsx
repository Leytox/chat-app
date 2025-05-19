import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="size-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce max-sm:size-12"
            >
              <MessageSquare className="size-8 text-primary max-sm:size-6" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold max-sm:text-xl">
          Welcome to Chatty!
        </h2>
        <p className="text-base-content/60 max-sm:text-sm">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
