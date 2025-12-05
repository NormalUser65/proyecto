import { useState, useRef, useEffect } from 'react';
import { Ticket } from 'lucide-react';
import { useTranslation } from "react-i18next";

export function NotificationButton({ ticketCount = 0, notifications = [] }) {
    const { t } = useTranslation("menuNotificaciones");
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    //se cierra el men[u cuando le dan click afuera]
    useEffect(() => {
        function handleClickOutside(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setOpen(false);
        }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
        <button
            className="relative hover:opacity-90 focus:outline-none"
            onClick={() => setOpen(!open)}
        >
            <div className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
            <Ticket className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 rounded-full bg-red-500 px-2 py-0 text-xs font-semibold text-white">
            {ticketCount}
            </div>
        </button>

        {open && (
            <div className="absolute right-0 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            {notifications.length === 0 ? (
                <div className="p-4 text-gray-500 text-sm">{t("menuNotificaciones.sinNotificaciones")}</div>
            ) : (
                notifications.map((n, idx) => (
                <div
                    key={idx}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                    {n.message}
                </div>
                ))
            )}
            </div>
        )}
        </div>
    );
}
