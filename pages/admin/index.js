import AuthCheck from "@/components/AuthCheck";

export default function AdminPostsPage({ }) {
    return (
        <main>
            <AuthCheck>
                <p>Putos!</p>
            </AuthCheck>
        </main>
    )
}