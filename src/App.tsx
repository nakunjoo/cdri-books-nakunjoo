import Container from "./components/Container";
import { TabProvider } from "./contexts/TabContext";
import Header from "./components/Header";

function App() {
  return (
    <main className="w-full">
      <TabProvider>
        <Header />
        <div className="w-full max-w-[960px] mx-auto">
          <Container />
        </div>
      </TabProvider>
    </main>
  );
}

export default App;
