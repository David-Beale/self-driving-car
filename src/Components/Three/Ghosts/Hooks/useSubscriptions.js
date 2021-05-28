import { useEffect } from "react";

export const useSubscriptions = (ghostCar, ghostRef) => {
  useEffect(() => {
    const ghost = ghostRef.current;
    const subscription1 = ghost.api.position.subscribe((p) => {
      if (!ghostCar) return;
      ghostCar.position.set(p[0], -p[2]);
    });
    const subscription2 = ghost.api.velocity.subscribe((v) => {
      if (!ghostCar) return;
      ghostCar.velocityVector.set(...v);
      ghostCar.velocity = ghostCar.velocityVector.length();
    });
    const subscription3 = ghost.api.rotation.subscribe((r) => {
      if (!ghostCar) return;
      ghostCar.rotation = r[1] - Math.PI / 2;
    });

    return () => {
      subscription1();
      subscription2();
      subscription3();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
