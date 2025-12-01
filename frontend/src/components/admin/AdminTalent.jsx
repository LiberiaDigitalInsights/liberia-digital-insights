import { Card, CardContent, CardHeader, CardTitle } from '../ui';
import { Button } from '../ui';
import { Badge } from '../ui';
import { useTalents } from '../../hooks/useBackendApi';
import { backendApi } from '../../services/backendApi';
import { useToast } from '../../context/ToastContext';

const AdminTalent = () => {
  const { showToast } = useToast();
  const { data: talentsData, loading, refetch } = useTalents({});
  const talents = talentsData?.talents || [];

  const handleStatusChange = async (talentId, newStatus) => {
    try {
      await backendApi.talents.update(talentId, { status: newStatus });
      await refetch();

      showToast({
        title: 'Status Updated',
        description: `Talent status changed to ${newStatus}.`,
        variant: 'success',
      });
    } catch {
      showToast({
        title: 'Error',
        description: 'Failed to update talent status.',
        variant: 'error',
      });
    }
  };

  const handleDelete = async (talentId) => {
    if (window.confirm('Are you sure you want to delete this talent profile?')) {
      try {
        await backendApi.talents.delete(talentId);
        await refetch();

        showToast({
          title: 'Talent Deleted',
          description: 'Talent profile has been removed.',
          variant: 'success',
        });
      } catch {
        showToast({
          title: 'Error',
          description: 'Failed to delete talent profile.',
          variant: 'error',
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-700',
      published: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };

    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-700'}>
        {status || 'unknown'}
      </Badge>
    );
  };

  const pendingTalents = talents.filter((t) => t.status === 'pending');
  const publishedTalents = talents.filter((t) => t.status === 'published');
  const rejectedTalents = talents.filter((t) => t.status === 'rejected');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Talent Hub Management</h1>
        <p className="text-[var(--color-muted)]">Review and manage talent profile submissions</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[var(--color-text)]">{talents.length}</div>
            <div className="text-sm text-[var(--color-muted)]">Total Talents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingTalents.length}</div>
            <div className="text-sm text-[var(--color-muted)]">Pending Approval</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{publishedTalents.length}</div>
            <div className="text-sm text-[var(--color-muted)]">Published</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{rejectedTalents.length}</div>
            <div className="text-sm text-[var(--color-muted)]">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      {pendingTalents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals ({pendingTalents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTalents.map((talent) => (
                <div key={talent.id} className="p-4 border border-[var(--color-border)] rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-[var(--color-text)]">{talent.name}</h3>
                      <p className="text-sm text-[var(--color-muted)] mt-1">{talent.role}</p>
                      <p className="text-sm text-[var(--color-muted)]">{talent.category}</p>
                      <p className="text-sm text-[var(--color-muted)] mt-2">{talent.bio}</p>
                      {talent.links?.website && (
                        <p className="text-sm text-blue-600 mt-1">
                          <a href={talent.links.website} target="_blank" rel="noopener noreferrer">
                            Portfolio
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {getStatusBadge(talent.status)}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(talent.id, 'published')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => handleStatusChange(talent.id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => handleDelete(talent.id)}
                          className="bg-gray-600 hover:bg-gray-700 text-white"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Published Talents */}
      <Card>
        <CardHeader>
          <CardTitle>Published Talents ({publishedTalents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading talents...</div>
            </div>
          ) : publishedTalents.length > 0 ? (
            <div className="space-y-4">
              {publishedTalents.map((talent) => (
                <div key={talent.id} className="p-4 border border-[var(--color-border)] rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-[var(--color-text)]">{talent.name}</h3>
                      <p className="text-sm text-[var(--color-muted)] mt-1">{talent.role}</p>
                      <p className="text-sm text-[var(--color-muted)]">{talent.category}</p>
                      {talent.skills && (
                        <p className="text-sm text-[var(--color-muted)] mt-1">
                          Skills:{' '}
                          {Array.isArray(talent.skills) ? talent.skills.join(', ') : talent.skills}
                        </p>
                      )}
                      {talent.links?.website && (
                        <p className="text-sm text-blue-600 mt-1">
                          <a href={talent.links.website} target="_blank" rel="noopener noreferrer">
                            Portfolio
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {getStatusBadge(talent.status)}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => handleStatusChange(talent.id, 'pending')}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          Unpublish
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => handleDelete(talent.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--color-muted)]">
              No published talents found.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejected Talents */}
      {rejectedTalents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rejected Talents ({rejectedTalents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rejectedTalents.map((talent) => (
                <div
                  key={talent.id}
                  className="p-4 border border-[var(--color-border)] rounded-lg opacity-75"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-[var(--color-text)]">{talent.name}</h3>
                      <p className="text-sm text-[var(--color-muted)] mt-1">{talent.role}</p>
                      <p className="text-sm text-[var(--color-muted)]">{talent.category}</p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {getStatusBadge(talent.status)}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(talent.id, 'published')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => handleDelete(talent.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTalent;
