import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserListPage.css';

interface Role {
    role_id: number;
    role: string;
}

interface User {
    user_id: number;
    email: string;
    phone_number: string;
    role: Role;
}

export default function UserListPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const roles = ['User', 'Teacher', 'Admin'];

    const currentUserId = Number(localStorage.getItem('userId'));

    useEffect(() => {
        async function loadUsers() {
            try {
                const res = await fetch('http://localhost:4000/api/users');
                const data = await res.json();
                setUsers(data);
            } catch (e) {
                console.error('Ошибка загрузки пользователей', e);
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, []);

    const handleDelete = async (user_id: number) => {
        if (user_id === currentUserId) {
            alert('Нельзя удалить самого себя.');
            return;
        }

        if (!confirm('Удалить пользователя?')) return;

        try {
            await fetch(`http://localhost:4000/api/users/${user_id}`, {
                method: 'DELETE',
            });
            setUsers(users.filter(u => u.user_id !== user_id));
        } catch (e) {
            console.error('Ошибка удаления пользователя', e);
        }
    };

    const handleRoleChange = async (user_id: number, newRole: string) => {
        if (user_id === currentUserId) {
            alert('Нельзя изменить собственную роль.');
            return;
        }

        try {
            await fetch(`http://localhost:4000/api/users/${user_id}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole.charAt(0).toUpperCase() + newRole.slice(1).toLowerCase() })
            });

            setUsers(prev =>
                prev.map(user =>
                    user.user_id === user_id
                        ? { ...user, role: { ...user.role, role: newRole } }
                        : user
                )
            );
        } catch (e) {
            console.error('Ошибка изменения роли', e);
        }
    };

    if (loading) return <p>Загрузка...</p>;

    return (
        <div className="user-list-page">
            <h1>Пользователи</h1>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Телефон</th>
                        <th>Роль</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>{user.email}</td>
                            <td>{user.phone_number}</td>
                            <td>
                                <select
                                    value={user.role.role}
                                    disabled={user.user_id === currentUserId}
                                    onChange={e =>
                                        handleRoleChange(user.user_id, e.target.value)
                                    }
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <Link to={`/users/${user.user_id}`}>🔍</Link> &nbsp;
                                <Link to={`/users/${user.user_id}/edit`}>✏️</Link> &nbsp;
                                <button
                                    onClick={() => handleDelete(user.user_id)}
                                    disabled={user.user_id === currentUserId}
                                    title={user.user_id === currentUserId ? 'Нельзя удалить себя' : ''}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
