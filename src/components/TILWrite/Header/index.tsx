import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useGetTil } from '@/api/hooks/til';
import Icon from '@/components/common/Icon';
import Logo from '@/components/common/Logo';
import { useToast } from '@/components/common/Toast/useToast';
import { tilyLinks } from '@/constants/links';
import * as Styled from './style';

interface HeaderProps {
  TILContent: string;
  handleOpenCommentAside: () => void;
}

const Header = (props: HeaderProps) => {
  const { TILContent, handleOpenCommentAside } = props;

  const [isExtensionInstall, setIsExtensionInstall] = useState(false);

  const router = useRouter();
  const toast = useToast();

  const { tilDetail } = useGetTil({
    roadmapId: Number(router.query.roadmapId),
    stepId: Number(router.query.stepId),
    tilId: Number(router.query.tilId),
  });

  useEffect(() => {
    const isInstalled = document.documentElement.getAttribute('myextension');

    if (isInstalled) {
      setIsExtensionInstall(true);
    } else {
      setIsExtensionInstall(false);
    }
  }, []);

  useEffect(() => {
    const handleCustomEventError = (event: CustomEvent<{ message: string }>) => {
      toast.show({ message: event.detail.message, isError: true });
    };

    const handleCustomEventSuccess = (event: CustomEvent<{ message: string }>) => {
      toast.show({ message: event.detail.message });
    };

    document.addEventListener('크롬익스텐션에러', (event) =>
      handleCustomEventError(event as CustomEvent<{ message: string }>),
    );
    document.addEventListener('크롬익스텐션성공', (event) =>
      handleCustomEventSuccess(event as CustomEvent<{ message: string }>),
    );

    return () => {
      document.removeEventListener('크롬익스텐션에러', (event) =>
        handleCustomEventError(event as CustomEvent<{ message: string }>),
      );
      document.removeEventListener('크롬익스텐션성공', (event) =>
        handleCustomEventSuccess(event as CustomEvent<{ message: string }>),
      );
    };
  }, []);

  return (
    <Styled.Root>
      <button onClick={() => router.push(tilyLinks.home())}>
        <Logo type="logo" imageSize={32} />
      </button>
      <Styled.Title>{tilDetail?.step.title}</Styled.Title>

      <Styled.Container>
        {isExtensionInstall ? (
          <button
            id="github_extenstion"
            onClick={() => {
              const detail = {
                isPersonal: tilDetail?.isPersonal,
                roadmapTitle: '조금만 더 화이팅',
                stepTitle: tilDetail?.step.title,
                content: TILContent,
              };
              const event = new CustomEvent('크롬익스텐션이벤트', { detail });
              document.dispatchEvent(event);
            }}>
            <Image src="/assets/icons/ic_github.svg" width={32} height={32} alt="깃허브 익스텐션" />
          </button>
        ) : (
          <button id="github_extenstion" onClick={() => router.push('/')}>
            <Image src="/assets/icons/ic_github.svg" width={32} height={32} alt="깃허브 익스텐션" />
          </button>
        )}

        {!tilDetail?.isPersonal && (
          <Icon onClick={handleOpenCommentAside} iconName="ic_commentBlack" imageSize={32} ext="svg" alt="코멘트" />
        )}
      </Styled.Container>
    </Styled.Root>
  );
};

export default Header;
