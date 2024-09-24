import PushSampleButton from '@components/samples/push-sample-button';

interface SampleComponentsProps {
  title: string;
}

const SampleComponents = ({ title }: SampleComponentsProps) => {
  return (
    <div>
      {title === 'PWA에 웹 푸시(Web Push)를 적용해보자' && (
        <>
          <br />
          <br />
          <hr />
          <br />
          <br />
          <h1 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">
            클릭하면 Push가 이렇게 날라온다!
          </h1>
          <PushSampleButton />
        </>
      )}
    </div>
  );
};

export default SampleComponents;
