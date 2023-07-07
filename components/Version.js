import { toast } from "react-hot-toast";

export default function Version() {
    return (
        <button onClick={() => {
                                toast('🐣 This App still in its early development, you are using version Alpha 0.0.1', 
                                    {
                                        duration: 6000,
                                    }
                                )
                            }
                        } 
                className="bottom-right">Alpha v0.0.1</button>
    )
}