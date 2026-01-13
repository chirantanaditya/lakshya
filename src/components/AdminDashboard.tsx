import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNo?: string;
  education?: string;
  createdAt: string;
  firoBStatus?: string;
  generalAptitudeStatus?: string;
  gatbPart2Status?: string;
  gatbPart3Status?: string;
  gatbPart4Status?: string;
  gatbPart5Status?: string;
  gatbPart6Status?: string;
  gatbPart7Status?: string;
  workValuesStatus?: string;
  interestInventoryStatus?: string;
  personalityAspectStatus?: string;
  behaviorResponseStatus?: string;
  enableFiroB?: boolean;
  enableWorkValues?: boolean;
  enableGeneralAptitude?: boolean;
  enableInterestInventory?: boolean;
  enablePersonalityAspect?: boolean;
  enableBehaviorResponse?: boolean;
  testCompleted?: boolean;
  candidateReport?: string;
}

interface TestResponse {
  id: string;
  userId: string;
  testType: string;
  responses: any;
  score?: any;
  completedAt?: string;
  createdAt: string;
}

interface QuestionDetail {
  id?: string;
  questionNumber?: string;
  questionText?: string;
  questionImage?: string;
  options?: any;
  correctAnswer?: string | string[];
  [key: string]: any;
}

interface TestDetails {
  users: User[];
  testResponses?: TestResponse[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export default function AdminDashboard() {
  const [testDetails, setTestDetails] = useState<TestDetails | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userResponses, setUserResponses] = useState<TestResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<TestResponse | null>(null);
  const [responseQuestions, setResponseQuestions] = useState<QuestionDetail[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'invite' | 'assign'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Assign tests state
  const [selectedUserForAssign, setSelectedUserForAssign] = useState<User | null>(null);
  const [testAssignments, setTestAssignments] = useState<Record<string, boolean>>({});
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestDetails();
  }, []);

  const fetchTestDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/test-details');
      
      let data: any;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch test details');
      }
      
      setTestDetails(data);
    } catch (err: any) {
      console.error('Error fetching test details:', err);
      setError(err.message || 'Failed to load test details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/test-details?userId=${userId}`);
      
      let data: any;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user details');
      }
      
      setSelectedUser(data.user);
      setUserResponses(data.testResponses || []);
    } catch (err: any) {
      console.error('Error fetching user details:', err);
      setError(err.message || 'Failed to load user details');
    }
  };

  const fetchResponseDetails = async (testResponse: TestResponse) => {
    try {
      setLoadingQuestions(true);
      setSelectedResponse(testResponse);
      
      // Fetch questions for this test type
      const response = await fetch(`/api/admin/test-response-details?testType=${testResponse.testType}`);
      if (response.ok) {
        const data = await response.json();
        setResponseQuestions(data.questions || []);
      } else {
        setResponseQuestions([]);
      }
    } catch (err: any) {
      console.error('Error fetching response details:', err);
      setResponseQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const formatTestType = (testType: string) => {
    return testType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatScore = (score: any) => {
    if (!score) return null;
    if (typeof score === 'object') {
      if (score.correctAnswers !== undefined && score.totalQuestions !== undefined) {
        return `${score.correctAnswers}/${score.totalQuestions} (${score.percentage || 0}%)`;
      }
      if (score.score !== undefined && score.totalQuestions !== undefined) {
        return `${score.score}/${score.totalQuestions} (${score.percentage || 0}%)`;
      }
      return JSON.stringify(score, null, 2);
    }
    return score.toString();
  };

  const handleSelectUserForAssign = (user: User) => {
    setSelectedUserForAssign(user);
    const generalAptitudeEnabled = user.enableGeneralAptitude || false;
    setTestAssignments({
      'firo-b': user.enableFiroB || false,
      'work-values': user.enableWorkValues || false,
      'general-aptitude': generalAptitudeEnabled,
      'gatb-part-1': generalAptitudeEnabled,
      'gatb-part-2': generalAptitudeEnabled,
      'gatb-part-3': generalAptitudeEnabled,
      'gatb-part-4': generalAptitudeEnabled,
      'gatb-part-5': generalAptitudeEnabled,
      'gatb-part-6': generalAptitudeEnabled,
      'gatb-part-7': generalAptitudeEnabled,
      'interest-inventory': user.enableInterestInventory || false,
      'personality-aspect': user.enablePersonalityAspect || false,
      'behavior-response': user.enableBehaviorResponse || false,
    });
    setAssignError(null);
    setAssignSuccess(false);
  };

  const handleAssignTests = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForAssign) return;

    setAssignLoading(true);
    setAssignError(null);
    setAssignSuccess(false);

    try {
      // Process test assignments - if any GATB part is enabled, enable general-aptitude
      const processedTests = { ...testAssignments };
      const anyGatbPartEnabled = 
        processedTests['gatb-part-1'] || 
        processedTests['gatb-part-2'] || 
        processedTests['gatb-part-3'] || 
        processedTests['gatb-part-4'] || 
        processedTests['gatb-part-5'] || 
        processedTests['gatb-part-6'] || 
        processedTests['gatb-part-7'] ||
        processedTests['general-aptitude'];
      
      processedTests['general-aptitude'] = anyGatbPartEnabled;
      
      // Remove individual GATB part assignments as they're handled by general-aptitude
      delete processedTests['gatb-part-1'];
      delete processedTests['gatb-part-2'];
      delete processedTests['gatb-part-3'];
      delete processedTests['gatb-part-4'];
      delete processedTests['gatb-part-5'];
      delete processedTests['gatb-part-6'];
      delete processedTests['gatb-part-7'];

      const response = await fetch('/api/admin/assign-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUserForAssign.id,
          tests: processedTests,
        }),
      });

      let data: any;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to assign tests');
      }

      setAssignSuccess(true);
      
      // Update the selected user with the returned data
      if (data.user) {
        setSelectedUserForAssign(data.user as User);
      }
      
      // Refresh the test details to get updated data after a short delay
      // to ensure the database update has completed
      setTimeout(async () => {
        await fetchTestDetails();
      }, 500);
      
      // Reset success message after 3 seconds
      setTimeout(() => setAssignSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error assigning tests:', err);
      setAssignError(err.message || 'Failed to assign tests');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleInviteStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError(null);
    setInviteSuccess(false);

    try {
      const response = await fetch('/api/admin/invite-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          name: inviteName,
          message: inviteMessage,
        }),
      });

      let data: any;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }

      setInviteSuccess(true);
      setInviteEmail('');
      setInviteName('');
      setInviteMessage('');
      
      // Reset success message after 5 seconds
      setTimeout(() => setInviteSuccess(false), 5000);
    } catch (err: any) {
      setInviteError(err.message || 'Failed to send invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const isCompleted = status === 'Completed';
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          isCompleted
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {status}
      </span>
    );
  };

  const filteredUsers = testDetails?.users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'completed') {
      return matchesSearch && user.testCompleted === true;
    }
    if (filterStatus === 'pending') {
      return matchesSearch && user.testCompleted !== true;
    }
    return matchesSearch;
  }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error && !testDetails) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Test Overview
          </button>
          <button
            onClick={() => setActiveTab('invite')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'invite'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Invite Students
          </button>
          <button
            onClick={() => setActiveTab('assign')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assign'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Assign Tests
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600">Total Users</div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {testDetails?.pagination.total || 0}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600">Tests Completed</div>
              <div className="text-2xl font-bold text-green-600 mt-2">
                {testDetails?.users.filter((u) => u.testCompleted).length || 0}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600">Pending Tests</div>
              <div className="text-2xl font-bold text-yellow-600 mt-2">
                {testDetails?.users.filter((u) => !u.testCompleted).length || 0}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600">This Month</div>
              <div className="text-2xl font-bold text-blue-600 mt-2">
                {
                  testDetails?.users.filter((u) => {
                    const created = new Date(u.createdAt);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() &&
                           created.getFullYear() === now.getFullYear();
                  }).length || 0
                }
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="completed">Tests Completed</option>
                  <option value="pending">Tests Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Education
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enabled Tests
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const enabledTestsCount = [
                        user.enableFiroB,
                        user.enableWorkValues,
                        user.enableGeneralAptitude, // This enables all 7 GATB parts
                        user.enableInterestInventory,
                        user.enablePersonalityAspect,
                        user.enableBehaviorResponse,
                      ].filter(Boolean).length;

                      return (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.education || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.testCompleted ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {enabledTestsCount > 0 ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {enabledTestsCount} test{enabledTestsCount !== 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">None</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => fetchUserDetails(user.id)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                View
                              </button>
                              <button
                                onClick={() => {
                                  handleSelectUserForAssign(user);
                                  setActiveTab('assign');
                                }}
                                className="text-green-600 hover:text-green-900"
                              >
                                Assign Tests
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Response Details Modal */}
          {selectedResponse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {formatTestType(selectedResponse.testType)} - Detailed Results
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Candidate: {selectedUser?.name} ({selectedUser?.email})
                      </p>
                      {selectedResponse.completedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Completed: {new Date(selectedResponse.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedResponse(null);
                        setResponseQuestions([]);
                      }}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Score Summary */}
                  {selectedResponse.score && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Score Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {selectedResponse.score.correctAnswers !== undefined && (
                          <div>
                            <span className="text-gray-600">Correct:</span>
                            <span className="ml-2 font-semibold text-green-700">
                              {selectedResponse.score.correctAnswers}
                            </span>
                          </div>
                        )}
                        {selectedResponse.score.incorrectAnswers !== undefined && (
                          <div>
                            <span className="text-gray-600">Incorrect:</span>
                            <span className="ml-2 font-semibold text-red-700">
                              {selectedResponse.score.incorrectAnswers}
                            </span>
                          </div>
                        )}
                        {selectedResponse.score.totalQuestions !== undefined && (
                          <div>
                            <span className="text-gray-600">Total:</span>
                            <span className="ml-2 font-semibold text-gray-900">
                              {selectedResponse.score.totalQuestions}
                            </span>
                          </div>
                        )}
                        {selectedResponse.score.percentage !== undefined && (
                          <div>
                            <span className="text-gray-600">Percentage:</span>
                            <span className="ml-2 font-semibold text-blue-700">
                              {selectedResponse.score.percentage}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Question-by-Question Breakdown */}
                  {loadingQuestions ? (
                    <div className="text-center py-8 text-gray-600">Loading question details...</div>
                  ) : responseQuestions.length > 0 && selectedResponse.score?.details ? (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Question-by-Question Breakdown</h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {selectedResponse.score.details.map((detail: any, index: number) => {
                          const question = responseQuestions.find(
                            (q: any) => 
                              (q['Item ID'] || q['Question No'] || q['Question No.'] || q.questionNumber) === detail.questionNumber
                          ) || responseQuestions[index];
                          
                          return (
                            <div
                              key={index}
                              className={`border rounded-lg p-3 ${
                                detail.isCorrect
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-red-50 border-red-200'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900">
                                      Q{detail.questionNumber || index + 1}:
                                    </span>
                                    {detail.isCorrect ? (
                                      <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                        ✓ Correct
                                      </span>
                                    ) : (
                                      <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded">
                                        ✗ Incorrect
                                      </span>
                                    )}
                                  </div>
                                  {question && (
                                    <div className="text-sm text-gray-700 mb-2">
                                      {question['Question Text'] || question.questionText || question.questionNumber}
                                    </div>
                                  )}
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <span className="text-gray-600">User Answer:</span>
                                      <span className={`ml-2 font-medium ${
                                        detail.isCorrect ? 'text-green-700' : 'text-red-700'
                                      }`}>
                                        {Array.isArray(detail.userAnswer) 
                                          ? detail.userAnswer.join(', ') 
                                          : detail.userAnswer || 'N/A'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Correct Answer:</span>
                                      <span className="ml-2 font-medium text-gray-900">
                                        {Array.isArray(detail.correctAnswer) 
                                          ? detail.correctAnswer.join(', ') 
                                          : detail.correctAnswer || 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : selectedResponse.responses && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Responses</h3>
                      <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs overflow-x-auto">
                        {JSON.stringify(selectedResponse.responses, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* User Details Modal */}
          {selectedUser && !selectedResponse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      User Details: {selectedUser.name}
                    </h2>
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        setUserResponses([]);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* User Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">User Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 text-gray-900">{selectedUser.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <span className="ml-2 text-gray-900">
                            {selectedUser.phoneNo || '-'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Education:</span>
                          <span className="ml-2 text-gray-900">
                            {selectedUser.education || '-'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Joined:</span>
                          <span className="ml-2 text-gray-900">
                            {new Date(selectedUser.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Test Statuses */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Test Statuses</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">GATB Part 1</span>
                          {getStatusBadge(selectedUser.generalAptitudeStatus)}
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">GATB Part 2</span>
                          {getStatusBadge(selectedUser.gatbPart2Status)}
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">GATB Part 3</span>
                          {getStatusBadge(selectedUser.gatbPart3Status)}
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">GATB Part 4</span>
                          {getStatusBadge(selectedUser.gatbPart4Status)}
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">GATB Part 5</span>
                          {getStatusBadge(selectedUser.gatbPart5Status)}
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">GATB Part 6</span>
                          {getStatusBadge(selectedUser.gatbPart6Status)}
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">GATB Part 7</span>
                          {getStatusBadge(selectedUser.gatbPart7Status)}
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">Work Values</span>
                          {getStatusBadge(selectedUser.workValuesStatus)}
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">FIRO-B</span>
                          {getStatusBadge(selectedUser.firoBStatus)}
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">Interest Inventory</span>
                          {getStatusBadge(selectedUser.interestInventoryStatus)}
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">Personality Aspect</span>
                          {getStatusBadge(selectedUser.personalityAspectStatus)}
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">Behavior Response</span>
                          {getStatusBadge(selectedUser.behaviorResponseStatus)}
                        </div>
                      </div>
                    </div>

                    {/* Test Responses */}
                    {userResponses.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Test Responses & Scores</h3>
                        <div className="space-y-3">
                          {userResponses.map((response) => (
                            <div
                              key={response.id}
                              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <span className="font-medium text-gray-900">
                                    {formatTestType(response.testType)}
                                  </span>
                                  {response.score && (
                                    <div className="mt-1">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Score: {formatScore(response.score)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 items-start">
                                  {response.completedAt && (
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                      {new Date(response.completedAt).toLocaleString()}
                                    </span>
                                  )}
                                  <button
                                    onClick={() => fetchResponseDetails(response)}
                                    className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Invite Tab */}
      {activeTab === 'invite' && (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Invite Student</h2>

          {inviteSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              Invitation sent successfully!
            </div>
          )}

          {inviteError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {inviteError}
            </div>
          )}

          <form onSubmit={handleInviteStudent} className="space-y-4">
            <div>
              <label
                htmlFor="invite-email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="invite-email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="student@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="invite-name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name (Optional)
              </label>
              <input
                type="text"
                id="invite-name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Student Name"
              />
            </div>

            <div>
              <label
                htmlFor="invite-message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Personal Message (Optional)
              </label>
              <textarea
                id="invite-message"
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add a personal message to the invitation..."
              />
            </div>

            <button
              type="submit"
              disabled={inviteLoading}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {inviteLoading ? 'Sending...' : 'Send Invitation'}
            </button>
          </form>
        </div>
      )}

      {/* Assign Tests Tab */}
      {activeTab === 'assign' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Assign Tests to Candidates</h2>

            {assignSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                Tests assigned successfully!
              </div>
            )}

            {assignError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {assignError}
              </div>
            )}

            {/* User Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Candidate
              </label>
              <select
                value={selectedUserForAssign?.id || ''}
                onChange={(e) => {
                  const user = testDetails?.users.find(u => u.id === e.target.value);
                  if (user) {
                    handleSelectUserForAssign(user);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">-- Select a candidate --</option>
                {testDetails?.users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Test Assignment Form */}
            {selectedUserForAssign && (
              <form onSubmit={handleAssignTests} className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Assigning tests to: {selectedUserForAssign.name}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedUserForAssign.email}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-900">General Aptitude Test Battery (GATB)</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newAssignments = { ...testAssignments };
                          // Enable all GATB parts
                          [1, 2, 3, 4, 5, 6, 7].forEach((part) => {
                            newAssignments[`gatb-part-${part}`] = true;
                          });
                          newAssignments['general-aptitude'] = true;
                          setTestAssignments(newAssignments);
                        }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                      >
                        Assign All GATB Tests
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[1, 2, 3, 4, 5, 6, 7].map((part) => {
                        const partKey = `gatb-part-${part}`;
                        const isEnabled = testAssignments[partKey] || false;
                        return (
                          <label
                            key={part}
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={(e) => {
                                const newAssignments = { ...testAssignments };
                                newAssignments[partKey] = e.target.checked;
                                // If any part is checked, enable general-aptitude
                                if (e.target.checked) {
                                  newAssignments['general-aptitude'] = true;
                                } else {
                                  // If unchecking, check if any other part is still enabled
                                  const anyOtherPartEnabled = [1, 2, 3, 4, 5, 6, 7].some(
                                    (p) => p !== part && newAssignments[`gatb-part-${p}`]
                                  );
                                  if (!anyOtherPartEnabled) {
                                    newAssignments['general-aptitude'] = false;
                                  }
                                }
                                setTestAssignments(newAssignments);
                              }}
                              className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">GATB Part {part}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Other Assessments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* FIRO-B */}
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={testAssignments['firo-b'] || false}
                          onChange={(e) =>
                            setTestAssignments({ ...testAssignments, 'firo-b': e.target.checked })
                          }
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">FIRO-B</div>
                          <div className="text-sm text-gray-500">Fundamental Interpersonal Relations Orientation</div>
                        </div>
                      </label>

                      {/* Work Values */}
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={testAssignments['work-values'] || false}
                          onChange={(e) =>
                            setTestAssignments({ ...testAssignments, 'work-values': e.target.checked })
                          }
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">Work Values</div>
                          <div className="text-sm text-gray-500">Work Values Assessment</div>
                        </div>
                      </label>

                      {/* Interest Inventory */}
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={testAssignments['interest-inventory'] || false}
                          onChange={(e) =>
                            setTestAssignments({ ...testAssignments, 'interest-inventory': e.target.checked })
                          }
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">Interest Inventory</div>
                          <div className="text-sm text-gray-500">Career Interest Assessment</div>
                        </div>
                      </label>

                      {/* Personality Aspect */}
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={testAssignments['personality-aspect'] || false}
                          onChange={(e) =>
                            setTestAssignments({ ...testAssignments, 'personality-aspect': e.target.checked })
                          }
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">Personality Aspect</div>
                          <div className="text-sm text-gray-500">Personality Assessment</div>
                        </div>
                      </label>

                      {/* Behavior Response */}
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={testAssignments['behavior-response'] || false}
                          onChange={(e) =>
                            setTestAssignments({ ...testAssignments, 'behavior-response': e.target.checked })
                          }
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">Behavior Response</div>
                          <div className="text-sm text-gray-500">Behavioral Response Assessment</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={assignLoading}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {assignLoading ? 'Assigning...' : 'Assign Tests'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUserForAssign(null);
                      setTestAssignments({});
                      setAssignError(null);
                      setAssignSuccess(false);
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </form>
            )}

            {/* Current Test Assignments Display */}
            {selectedUserForAssign && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Currently Enabled Tests:</h4>
                <div className="space-y-2">
                  {selectedUserForAssign.enableGeneralAptitude && (
                    <div>
                      <span className="text-xs font-medium text-gray-700 mb-1 block">General Aptitude Test Battery (GATB):</span>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map((part) => (
                          <span key={part} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            GATB Part {part}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {selectedUserForAssign.enableFiroB && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">FIRO-B</span>
                    )}
                    {selectedUserForAssign.enableWorkValues && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Work Values</span>
                    )}
                    {selectedUserForAssign.enableInterestInventory && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Interest Inventory</span>
                    )}
                    {selectedUserForAssign.enablePersonalityAspect && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Personality Aspect</span>
                    )}
                    {selectedUserForAssign.enableBehaviorResponse && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Behavior Response</span>
                    )}
                  </div>
                  {!selectedUserForAssign.enableFiroB &&
                    !selectedUserForAssign.enableWorkValues &&
                    !selectedUserForAssign.enableGeneralAptitude &&
                    !selectedUserForAssign.enableInterestInventory &&
                    !selectedUserForAssign.enablePersonalityAspect &&
                    !selectedUserForAssign.enableBehaviorResponse && (
                      <span className="text-gray-500 text-sm">No tests currently assigned</span>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

