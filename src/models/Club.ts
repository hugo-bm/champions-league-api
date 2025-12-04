/**
 *  Represent a club in the system
 */
export interface Club {
    /** @property The club's unique identifier*/
    id: number;
    /** @property The name of the football club */
    name: string;
    /** @property Country where the club is based */
    country: string;
  }