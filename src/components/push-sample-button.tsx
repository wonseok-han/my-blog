'use client';

import { usePushStore } from '@/store/push-store';

const PushSampleButton = () => {
  const { pushTrigger } = usePushStore();

  return <button onClick={pushTrigger}>테스트</button>;
};

export default PushSampleButton;
