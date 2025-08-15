import { Navigate } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';

type Props = {
    userId: number;
    children: JSX.Element;
};

export function AdminRoute({ userId, children }: Props) {
    const { role, loading } = useUserRole(userId);

    if (loading) return <p>Загрузка...</p>;
    if (role !== 'Admin') return <Navigate to="/unauthorized" replace />;

    return children;
}