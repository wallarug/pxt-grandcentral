namespace control {
    //% shim=pxt::deepSleep
    function _deepSleep() { }

    const CFG_PIN_JDPWR_ENABLE = 1104

    export function enableNeopixelPower(enabled = true) {
        const pin = pins.LIGHT_PWR
        if (pin)
            pin.digitalWrite(!enabled)
    }

    export function deepSleep() {
        enableNeopixelPower(false)
        const pin = pins.pinByCfg(CFG_PIN_JDPWR_ENABLE)
        if (pin)
            pin.digitalWrite(true) // disable JD power
        pause(10)
        _deepSleep()
    }

    function init() {
        if (pins.LDO_EN)
            pins.LDO_EN.digitalWrite(true)
        enableNeopixelPower()
        const fault = pins.LIGHT_FAULT
        if (fault) {
            fault.setPull(PinPullMode.PullUp)
            fault.digitalRead()
            forever(() => {
                if (pins.LIGHT_FAULT.digitalRead() == false) {
                    enableNeopixelPower(false)
                    pause(10)
                    enableNeopixelPower(true)
                }
                pause(1000)
            })
        }
    }
    init()
}