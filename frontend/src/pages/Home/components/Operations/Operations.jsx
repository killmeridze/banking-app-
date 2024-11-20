import { useState } from "react";
import { operationsData } from "./operationsData";
import { OperationTab } from "./OperationTab";
import { OperationContent } from "./OperationContent";
import { SectionTitle } from "../SectionTitle";

export const Operations = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (e, tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <section className="section" id="section--2">
      <SectionTitle
        description="Операции"
        header="Все максимально упрощено для вашего удобства."
      />

      <section className="operations">
        <section className="operations__tab-container">
          {operationsData.map((operation) => (
            <OperationTab
              key={operation.id}
              tab={operation.tab}
              isActive={activeTab === operation.id}
              onClick={(e) => handleTabClick(e, operation.id)}
              tabNumber={operation.id}
            />
          ))}
        </section>

        {operationsData.map((operation) => (
          <OperationContent
            key={operation.id}
            content={operation.content}
            isActive={activeTab === operation.id}
            tabNumber={operation.id}
          />
        ))}
      </section>
    </section>
  );
};
