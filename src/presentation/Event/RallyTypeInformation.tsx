import { DateTime } from "luxon";
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
        <div
          className="col start w100 pt2"
          style={{ height: "100%" }}
        >
          <p className="boxedDark mb2">
            Created{" "}
            {DateTime.fromJSDate(new Date(type.created_at)).toFormat(
              "MMM d y"
            )}
          </p>

          <div className="textLeft">
            <p className="boxedDark" style={{ height: 100 }}>
              {type.description}
            </p>
            <p className="mt2">
              {type.min_people == type.max_people
                ? `Must have ${type.min_people} player(s)`
                : `Must have ${type.min_people} - ${type.max_people} players`}
            </p>
          </div>
          <div className="pt2 row center"></div>
        </div>
      )}
    </div>
  );
}
