'use client'
import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchCommand from "@/components/SearchCommand";

interface NavItemsProps {
    initialStocks: Stock[];
    isMobile?: boolean; // Added to conditionally hide Dashboard
    onItemClick?: () => void; // Added to trigger dropdown close
}

const NavItems = ({ initialStocks, isMobile = false, onItemClick }: NavItemsProps) => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    }

    // Filter out the Dashboard ('/') link if we are rendering for mobile
    const itemsToRender = isMobile
        ? NAV_ITEMS.filter(item => item.href !== '/')
        : NAV_ITEMS;

    return (
        <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
            {itemsToRender.map(({ href, label }) => {
                if (href === '/search') return (
                    <li key="search-trigger">
                        <SearchCommand
                            renderAs="text"
                            label="Search"
                            initialStocks={initialStocks}
                        />
                    </li>
                )

                return (
                    <li key={href}>
                        <Link
                            href={href}
                            onClick={onItemClick} // Triggers the close function
                            className={`hover:text-yellow-500 transition-colors ${
                                isActive(href) ? 'text-gray-100' : ''
                            }`}
                        >
                            {label}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}
export default NavItems
