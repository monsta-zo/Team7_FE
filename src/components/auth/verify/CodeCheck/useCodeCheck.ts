import { type SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { type EmailCodeCheckRequest } from '@/api/auth/type';
import { usePostEmailCodeCheck } from '@/api/hooks/auth';
import { tilyLinks } from '@/constants/links';

const useCodeCheck = (location: 'register' | 'password', email: string) => {
  const router = useRouter();

  const { postEmailCodeCheckAsync, isLoading } = usePostEmailCodeCheck();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email,
      code: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<EmailCodeCheckRequest> = async (formData) => {
    const data = await postEmailCodeCheckAsync(formData);

    if (data?.code === 200) {
      if (location === 'register') {
        router.push({
          pathname: tilyLinks.register(),
          query: {
            email: email,
          },
        });
      } else {
        router.push({
          pathname: tilyLinks.changePassword(),
          query: {
            email: email,
          },
        });
      }
    }
  };

  return { isLoading, control, handleSubmit, errors, onSubmit };
};

export default useCodeCheck;
