import Header from "@/components/Header";

// A Layout component always receives a 'children' prop.
// This represents whatever active page the user is currently looking at inside this folder structure.
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        // The <main> wrapper ensures the background color and text styling are consistent.
        <main className="min-h-screen text-gray-400">

            {/* The Header stays static at the top of every page in this layout */}
            <Header />

            {/* This container creates padding around your page content.
                When the user visits the home page, the <Home /> component from page.tsx
                is injected right here where {children} is placed.
            */}
            <div className="container py-10">
                {children}
            </div>
        </main>
    )
}

export default Layout;
