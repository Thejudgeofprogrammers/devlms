import { useEffect, useState } from 'react';

export function useUserRole(userId: number | string) {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/users/${userId}/role`);
                const data = await res.text();
                setRole(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchRole();
    }, [userId]);

    return { role, loading };
}