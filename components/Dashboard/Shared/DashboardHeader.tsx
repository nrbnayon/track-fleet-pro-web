"use client"
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import TranslatedText from "@/components/Shared/TranslatedText";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="hidden md:flex items-center justify-between px-3 py-2 border rounded-md min-w-30 cursor-pointer hover:bg-gray-50 bg-white transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {language === "en" ? "English" : "Afan Oromo"}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("om")}>
          Afan Oromo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DashboardHeader({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    // const { logout } = useLogout();
    // const [showLogoutModal, setShowLogoutModal] = useState(false);
    return (
        <div className="bg-white flex justify-between items-center">
            <div className="flex flex-col items-start justify-between p-4 md:px-8">
                <h1 className="text-2xl font-bold text-[#0F304E]">
                    <TranslatedText text={title} />
                </h1>
                {description && (
                    <p className="text-secondary">
                        <TranslatedText text={description} />
                    </p>
                )}
            </div>
            <div>
          <div className="flex items-center gap-3 px-3">
             <LanguageSwitcher />
                  <Link
                    href="/profile" 
                    className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                     <Image src="/images/avatar.png" alt="User" width={40} height={40} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium truncate text-foreground">
                       Nayon
                      </p>
                      <p className="text-sm text-secondary truncate">
                        Super Admin
                      </p>
                    </div>
                  </Link>
                </div>
            </div>
        </div>
    )
}
