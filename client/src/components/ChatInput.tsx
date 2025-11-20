export const ChatInput = () => (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto flex items-end gap-2">
            <input type="text" placeholder="Написать сообщение..." className="flex-1 min-h-[44px] rounded-xl bg-gray-100 dark:bg-gray-700 px-4 py-2 border-none" />
            <button className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
                <i className="fa fa-paper-plane" />
            </button>
        </div>
    </div>
);
