'use client';

import { usePushStore } from '@/store/push-store';

const PushSampleButton = () => {
  const { pushTrigger } = usePushStore();

  return (
    <button className="m-2 p-3 bg-gray-300 rounded-md" onClick={pushTrigger}>
      클릭하면 푸시가 날라간다!
    </button>
  );
};

export default PushSampleButton;
