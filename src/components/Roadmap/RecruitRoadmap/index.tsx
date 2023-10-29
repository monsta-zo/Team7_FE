import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useGetRoadmaps } from '@/api/hooks/roadmap';
import * as Styled from '@/components/Roadmap/RecruitRoadmap/style';
import Input from '@/components/common/Input';
import Tab from '@/components/common/Tab';
import { useParamsToUrl } from '@/hooks/useParamsToUrl';
import useQueryParam from '@/hooks/useQueryParam';
import GroupCard from '../GroupCard';
import TilyCard from '../TilyCard';

const RecruitRoadmap = () => {
  const router = useRouter();
  const initialCategory = useQueryParam(router.query.category);
  const initialName = useQueryParam(router.query.name);

  // 초기값을 'tily'로 주면 깜빡임이 너무 심해보여서 차라리 null로 했습니다.
  const [category, setCategory] = useState<'tily' | 'group' | null>(null);
  const [name, setName] = useState<string>('');

  const { overlapParamsToUrl } = useParamsToUrl();

  const handleNameSearch = () => {
    overlapParamsToUrl({ name });
  };

  const data = useGetRoadmaps(router.query);

  useEffect(() => {
    if (router.isReady) {
      setCategory(initialCategory || 'tily');
      setName(initialName || '');
    }
  }, [router]);

  useEffect(() => {
    if (!router.isReady) return;
    if (category) {
      overlapParamsToUrl({ category });
    }
  }, [category]);

  return (
    <>
      <h2>로드맵 목록</h2>
      <Styled.Navbar>
        <Tab>
          <Tab.Menu
            onClick={() => {
              setCategory('tily');
            }}
            className={category === 'tily' ? 'selected' : ''}>
            TIL-y 로드맵
          </Tab.Menu>
          <Tab.Menu
            onClick={() => {
              setCategory('group');
            }}
            className={category === 'group' ? 'selected' : ''}>
            그룹 로드맵
          </Tab.Menu>
        </Tab>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}>
          <Input
            css={Styled.InputContainerStyles}
            placeholder="검색어를 입력하세요"
            endIcon="ic_search_2x"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onClick={handleNameSearch}
          />
        </form>
      </Styled.Navbar>

      <Styled.RoadmapContainer>
        {data?.result.category === 'tily'
          ? data?.result.roadmaps.map((roadmap) => <TilyCard key={roadmap.id} roadmap={roadmap} />)
          : data?.result.roadmaps.map((roadmap) => <GroupCard key={roadmap.id} roadmap={roadmap} />)}
      </Styled.RoadmapContainer>
    </>
  );
};

export default RecruitRoadmap;
