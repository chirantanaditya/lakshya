import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNo: z.string().optional(),
  education: z.enum(['High School Student', 'Senior School Student', 'College Student', 'Corporate Professional']).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfileFormProps {
  user: {
    id: string;
    name: string;
    firstName?: string | null;
    lastName?: string | null;
    phoneNo?: string | null;
    education?: string | null;
  } | null;
}

export default function UserProfileForm({ user }: UserProfileFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNo: user?.phoneNo || '',
      education: (user?.education as any) || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Update failed');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Profile updated successfully!
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            {...register('firstName')}
            type="text"
            id="firstName"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            {...register('lastName')}
            type="text"
            id="lastName"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          {...register('phoneNo')}
          type="tel"
          id="phoneNo"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="+91 1234567890"
        />
      </div>

      <div>
        <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
          Education Level
        </label>
        <select
          {...register('education')}
          id="education"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select...</option>
          <option value="High School Student">High School Student</option>
          <option value="Senior School Student">Senior School Student</option>
          <option value="College Student">College Student</option>
          <option value="Corporate Professional">Corporate Professional</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
        <a
          href="/dashboard"
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}


