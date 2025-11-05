import MainScreen from "@components/screens/MainScreen";
import {LoaderProvider} from "@components/contexts/LoaderContext";

export default function Home() {
  return (
    <>
      <LoaderProvider>
        <MainScreen/>
      </LoaderProvider>
    </>
  );
}
