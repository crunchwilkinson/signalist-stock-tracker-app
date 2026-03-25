import Header from "@/components/Header";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

// A Layout component always receives a 'children' prop.
// This represents whatever active page the user is currently looking at inside this folder structure.
const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session?.user) redirect('/sign-in');

    const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
    }
    return (
        // The <main> wrapper ensures the background color and text styling are consistent.
        <main className="min-h-screen text-gray-400">

            {/* The Header stays static at the top of every page in this layout */}
            <Header user={user} />

            {/* This container creates padding around your page content.
                When the user visits the home page, the <Home /> component from page.tsx
                is injected right here where children placed.
            */}
            <div className="container py-10">
                {children}
            </div>
        </main>
    )
}

export default Layout;
