import { ActivatableElement, RallyTypeObject } from "../../Types";

interface RallyTypeInformation extends ActivatableElement {
  type: RallyTypeObject | undefined;
}

export default function RallyTypeInformation({
  active,
  type,
}: RallyTypeInformation) {
  return (
    <div>
      {type && active && (
        <div className="col start w100 pt2" style={{ height: "100%" }}>
          <div className="textLeft">
              <p className="boxedDark" style={{ height: 100 }}>
              {type.description}
            </p>
            <p className="mt2">
              <strong>
                {type.min_people == type.max_people
                  ? `Must have ${type.min_people} player(s)`
                  : `Must have ${type.min_people} - ${type.max_people} players`}
              </strong>
            </p>
          </div>
          <div className="pt2 row center">
          </div>
        </div>
      )}
    </div>
  );
}
