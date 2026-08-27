/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
const $Object = $util.global.Object, $undefined = $util.global.undefined, $Error = $util.global.Error;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const peer_rpc = $root.peer_rpc = (() => {

    /**
     * Namespace peer_rpc.
     * @exports peer_rpc
     * @namespace
     */
    const peer_rpc = {};

    peer_rpc.TrustedCredentialPubkey = (function() {

        /**
         * Properties of a TrustedCredentialPubkey.
         * @typedef {Object} peer_rpc.TrustedCredentialPubkey.$Properties
         * @property {Uint8Array|null} [pubkey] TrustedCredentialPubkey pubkey
         * @property {Array.<string>|null} [groups] TrustedCredentialPubkey groups
         * @property {boolean|null} [allowRelay] TrustedCredentialPubkey allowRelay
         * @property {Long|null} [expiryUnix] TrustedCredentialPubkey expiryUnix
         * @property {Array.<string>|null} [allowedProxyCidrs] TrustedCredentialPubkey allowedProxyCidrs
         * @property {boolean|null} [reusable] TrustedCredentialPubkey reusable
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a TrustedCredentialPubkey.
         * @memberof peer_rpc
         * @interface ITrustedCredentialPubkey
         * @augments peer_rpc.TrustedCredentialPubkey.$Properties
         * @deprecated Use peer_rpc.TrustedCredentialPubkey.$Properties instead.
         */

        /**
         * Shape of a TrustedCredentialPubkey.
         * @typedef {peer_rpc.TrustedCredentialPubkey.$Properties} peer_rpc.TrustedCredentialPubkey.$Shape
         */

        /**
         * Constructs a new TrustedCredentialPubkey.
         * @memberof peer_rpc
         * @classdesc Represents a TrustedCredentialPubkey.
         * @constructor
         * @param {peer_rpc.TrustedCredentialPubkey.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const TrustedCredentialPubkey = function (properties) {
            this.groups = [];
            this.allowedProxyCidrs = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * TrustedCredentialPubkey pubkey.
         * @member {Uint8Array} pubkey
         * @memberof peer_rpc.TrustedCredentialPubkey
         * @instance
         */
        TrustedCredentialPubkey.prototype.pubkey = $util.newBuffer([]);

        /**
         * TrustedCredentialPubkey groups.
         * @member {Array.<string>} groups
         * @memberof peer_rpc.TrustedCredentialPubkey
         * @instance
         */
        TrustedCredentialPubkey.prototype.groups = $util.emptyArray;

        /**
         * TrustedCredentialPubkey allowRelay.
         * @member {boolean} allowRelay
         * @memberof peer_rpc.TrustedCredentialPubkey
         * @instance
         */
        TrustedCredentialPubkey.prototype.allowRelay = false;

        /**
         * TrustedCredentialPubkey expiryUnix.
         * @member {Long} expiryUnix
         * @memberof peer_rpc.TrustedCredentialPubkey
         * @instance
         */
        TrustedCredentialPubkey.prototype.expiryUnix = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * TrustedCredentialPubkey allowedProxyCidrs.
         * @member {Array.<string>} allowedProxyCidrs
         * @memberof peer_rpc.TrustedCredentialPubkey
         * @instance
         */
        TrustedCredentialPubkey.prototype.allowedProxyCidrs = $util.emptyArray;

        /**
         * TrustedCredentialPubkey reusable.
         * @member {boolean|null|undefined} reusable
         * @memberof peer_rpc.TrustedCredentialPubkey
         * @instance
         */
        TrustedCredentialPubkey.prototype.reusable = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(TrustedCredentialPubkey.prototype, "_reusable", {
            get: $util.oneOfGetter($oneOfFields = ["reusable"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified TrustedCredentialPubkey message. Does not implicitly {@link peer_rpc.TrustedCredentialPubkey.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.TrustedCredentialPubkey
         * @static
         * @param {peer_rpc.TrustedCredentialPubkey.$Properties} message TrustedCredentialPubkey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TrustedCredentialPubkey.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.pubkey != null && $Object.hasOwnProperty.call(message, "pubkey") && message.pubkey.length)
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.pubkey);
            if (message.groups != null && message.groups.length)
                for (let i = 0; i < message.groups.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.groups[i]);
            if (message.allowRelay != null && $Object.hasOwnProperty.call(message, "allowRelay") && message.allowRelay !== false)
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.allowRelay);
            if (message.expiryUnix != null && $Object.hasOwnProperty.call(message, "expiryUnix") && (typeof message.expiryUnix === "object" ? message.expiryUnix.low || message.expiryUnix.high : message.expiryUnix !== 0))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.expiryUnix);
            if (message.allowedProxyCidrs != null && message.allowedProxyCidrs.length)
                for (let i = 0; i < message.allowedProxyCidrs.length; ++i)
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.allowedProxyCidrs[i]);
            if (message.reusable != null && $Object.hasOwnProperty.call(message, "reusable"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.reusable);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a TrustedCredentialPubkey message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.TrustedCredentialPubkey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.TrustedCredentialPubkey & peer_rpc.TrustedCredentialPubkey.$Shape} TrustedCredentialPubkey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TrustedCredentialPubkey.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.TrustedCredentialPubkey(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.pubkey = value;
                        else
                            delete message.pubkey;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if (!(message.groups && message.groups.length))
                            message.groups = [];
                        message.groups.push(reader.stringVerify());
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.allowRelay = value;
                        else
                            delete message.allowRelay;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                            message.expiryUnix = value;
                        else
                            delete message.expiryUnix;
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        if (!(message.allowedProxyCidrs && message.allowedProxyCidrs.length))
                            message.allowedProxyCidrs = [];
                        message.allowedProxyCidrs.push(reader.stringVerify());
                        continue;
                    }
                case 6: {
                        if (wireType !== 0)
                            break;
                        message.reusable = reader.bool();
                        message._reusable = "reusable";
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return TrustedCredentialPubkey;
    })();

    peer_rpc.TrustedCredentialPubkeyProof = (function() {

        /**
         * Properties of a TrustedCredentialPubkeyProof.
         * @typedef {Object} peer_rpc.TrustedCredentialPubkeyProof.$Properties
         * @property {peer_rpc.TrustedCredentialPubkey.$Properties|null} [credential] TrustedCredentialPubkeyProof credential
         * @property {Uint8Array|null} [credentialHmac] TrustedCredentialPubkeyProof credentialHmac
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a TrustedCredentialPubkeyProof.
         * @memberof peer_rpc
         * @interface ITrustedCredentialPubkeyProof
         * @augments peer_rpc.TrustedCredentialPubkeyProof.$Properties
         * @deprecated Use peer_rpc.TrustedCredentialPubkeyProof.$Properties instead.
         */

        /**
         * Shape of a TrustedCredentialPubkeyProof.
         * @typedef {peer_rpc.TrustedCredentialPubkeyProof.$Properties} peer_rpc.TrustedCredentialPubkeyProof.$Shape
         */

        /**
         * Constructs a new TrustedCredentialPubkeyProof.
         * @memberof peer_rpc
         * @classdesc Represents a TrustedCredentialPubkeyProof.
         * @constructor
         * @param {peer_rpc.TrustedCredentialPubkeyProof.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const TrustedCredentialPubkeyProof = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * TrustedCredentialPubkeyProof credential.
         * @member {peer_rpc.TrustedCredentialPubkey.$Properties|null|undefined} credential
         * @memberof peer_rpc.TrustedCredentialPubkeyProof
         * @instance
         */
        TrustedCredentialPubkeyProof.prototype.credential = null;

        /**
         * TrustedCredentialPubkeyProof credentialHmac.
         * @member {Uint8Array} credentialHmac
         * @memberof peer_rpc.TrustedCredentialPubkeyProof
         * @instance
         */
        TrustedCredentialPubkeyProof.prototype.credentialHmac = $util.newBuffer([]);

        /**
         * Encodes the specified TrustedCredentialPubkeyProof message. Does not implicitly {@link peer_rpc.TrustedCredentialPubkeyProof.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.TrustedCredentialPubkeyProof
         * @static
         * @param {peer_rpc.TrustedCredentialPubkeyProof.$Properties} message TrustedCredentialPubkeyProof message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TrustedCredentialPubkeyProof.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.credential != null && $Object.hasOwnProperty.call(message, "credential"))
                $root.peer_rpc.TrustedCredentialPubkey.encode(message.credential, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.credentialHmac != null && $Object.hasOwnProperty.call(message, "credentialHmac") && message.credentialHmac.length)
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.credentialHmac);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a TrustedCredentialPubkeyProof message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.TrustedCredentialPubkeyProof
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.TrustedCredentialPubkeyProof & peer_rpc.TrustedCredentialPubkeyProof.$Shape} TrustedCredentialPubkeyProof
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TrustedCredentialPubkeyProof.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.TrustedCredentialPubkeyProof(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.credential = $root.peer_rpc.TrustedCredentialPubkey.decode(reader, reader.uint32(), $undefined, _depth + 1, message.credential);
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.credentialHmac = value;
                        else
                            delete message.credentialHmac;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return TrustedCredentialPubkeyProof;
    })();

    peer_rpc.RoutePeerInfo = (function() {

        /**
         * Properties of a RoutePeerInfo.
         * @typedef {Object} peer_rpc.RoutePeerInfo.$Properties
         * @property {number|null} [peerId] RoutePeerInfo peerId
         * @property {common.UUID.$Properties|null} [instId] RoutePeerInfo instId
         * @property {number|null} [cost] RoutePeerInfo cost
         * @property {common.Ipv4Addr.$Properties|null} [ipv4Addr] RoutePeerInfo ipv4Addr
         * @property {Array.<string>|null} [proxyCidrs] RoutePeerInfo proxyCidrs
         * @property {string|null} [hostname] RoutePeerInfo hostname
         * @property {common.NatType|null} [udpNatType] RoutePeerInfo udpNatType
         * @property {google.protobuf.Timestamp.$Properties|null} [lastUpdate] RoutePeerInfo lastUpdate
         * @property {number|null} [version] RoutePeerInfo version
         * @property {string|null} [easytierVersion] RoutePeerInfo easytierVersion
         * @property {common.PeerFeatureFlag.$Properties|null} [featureFlag] RoutePeerInfo featureFlag
         * @property {Long|null} [peerRouteId] RoutePeerInfo peerRouteId
         * @property {number|null} [networkLength] RoutePeerInfo networkLength
         * @property {number|null} [quicPort] RoutePeerInfo quicPort
         * @property {common.Ipv6Inet.$Properties|null} [ipv6Addr] RoutePeerInfo ipv6Addr
         * @property {Array.<peer_rpc.PeerGroupInfo.$Properties>|null} [groups] RoutePeerInfo groups
         * @property {common.NatType|null} [tcpNatType] RoutePeerInfo tcpNatType
         * @property {Uint8Array|null} [noiseStaticPubkey] RoutePeerInfo noiseStaticPubkey
         * @property {Array.<peer_rpc.TrustedCredentialPubkeyProof.$Properties>|null} [trustedCredentialPubkeys] RoutePeerInfo trustedCredentialPubkeys
         * @property {common.Ipv6Inet.$Properties|null} [ipv6PublicAddrPrefix] RoutePeerInfo ipv6PublicAddrPrefix
         * @property {common.Ipv6Inet.$Properties|null} [ipv6PublicAddrLease] RoutePeerInfo ipv6PublicAddrLease
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RoutePeerInfo.
         * @memberof peer_rpc
         * @interface IRoutePeerInfo
         * @augments peer_rpc.RoutePeerInfo.$Properties
         * @deprecated Use peer_rpc.RoutePeerInfo.$Properties instead.
         */

        /**
         * Shape of a RoutePeerInfo.
         * @typedef {peer_rpc.RoutePeerInfo.$Properties} peer_rpc.RoutePeerInfo.$Shape
         */

        /**
         * Constructs a new RoutePeerInfo.
         * @memberof peer_rpc
         * @classdesc Represents a RoutePeerInfo.
         * @constructor
         * @param {peer_rpc.RoutePeerInfo.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RoutePeerInfo = function (properties) {
            this.proxyCidrs = [];
            this.groups = [];
            this.trustedCredentialPubkeys = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RoutePeerInfo peerId.
         * @member {number} peerId
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.peerId = 0;

        /**
         * RoutePeerInfo instId.
         * @member {common.UUID.$Properties|null|undefined} instId
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.instId = null;

        /**
         * RoutePeerInfo cost.
         * @member {number} cost
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.cost = 0;

        /**
         * RoutePeerInfo ipv4Addr.
         * @member {common.Ipv4Addr.$Properties|null|undefined} ipv4Addr
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.ipv4Addr = null;

        /**
         * RoutePeerInfo proxyCidrs.
         * @member {Array.<string>} proxyCidrs
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.proxyCidrs = $util.emptyArray;

        /**
         * RoutePeerInfo hostname.
         * @member {string|null|undefined} hostname
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.hostname = null;

        /**
         * RoutePeerInfo udpNatType.
         * @member {common.NatType} udpNatType
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.udpNatType = 0;

        /**
         * RoutePeerInfo lastUpdate.
         * @member {google.protobuf.Timestamp.$Properties|null|undefined} lastUpdate
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.lastUpdate = null;

        /**
         * RoutePeerInfo version.
         * @member {number} version
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.version = 0;

        /**
         * RoutePeerInfo easytierVersion.
         * @member {string} easytierVersion
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.easytierVersion = "";

        /**
         * RoutePeerInfo featureFlag.
         * @member {common.PeerFeatureFlag.$Properties|null|undefined} featureFlag
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.featureFlag = null;

        /**
         * RoutePeerInfo peerRouteId.
         * @member {Long} peerRouteId
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.peerRouteId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * RoutePeerInfo networkLength.
         * @member {number} networkLength
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.networkLength = 0;

        /**
         * RoutePeerInfo quicPort.
         * @member {number|null|undefined} quicPort
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.quicPort = null;

        /**
         * RoutePeerInfo ipv6Addr.
         * @member {common.Ipv6Inet.$Properties|null|undefined} ipv6Addr
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.ipv6Addr = null;

        /**
         * RoutePeerInfo groups.
         * @member {Array.<peer_rpc.PeerGroupInfo.$Properties>} groups
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.groups = $util.emptyArray;

        /**
         * RoutePeerInfo tcpNatType.
         * @member {common.NatType} tcpNatType
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.tcpNatType = 0;

        /**
         * RoutePeerInfo noiseStaticPubkey.
         * @member {Uint8Array} noiseStaticPubkey
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.noiseStaticPubkey = $util.newBuffer([]);

        /**
         * RoutePeerInfo trustedCredentialPubkeys.
         * @member {Array.<peer_rpc.TrustedCredentialPubkeyProof.$Properties>} trustedCredentialPubkeys
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.trustedCredentialPubkeys = $util.emptyArray;

        /**
         * RoutePeerInfo ipv6PublicAddrPrefix.
         * @member {common.Ipv6Inet.$Properties|null|undefined} ipv6PublicAddrPrefix
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.ipv6PublicAddrPrefix = null;

        /**
         * RoutePeerInfo ipv6PublicAddrLease.
         * @member {common.Ipv6Inet.$Properties|null|undefined} ipv6PublicAddrLease
         * @memberof peer_rpc.RoutePeerInfo
         * @instance
         */
        RoutePeerInfo.prototype.ipv6PublicAddrLease = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(RoutePeerInfo.prototype, "_ipv4Addr", {
            get: $util.oneOfGetter($oneOfFields = ["ipv4Addr"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(RoutePeerInfo.prototype, "_hostname", {
            get: $util.oneOfGetter($oneOfFields = ["hostname"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(RoutePeerInfo.prototype, "_quicPort", {
            get: $util.oneOfGetter($oneOfFields = ["quicPort"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(RoutePeerInfo.prototype, "_ipv6Addr", {
            get: $util.oneOfGetter($oneOfFields = ["ipv6Addr"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(RoutePeerInfo.prototype, "_ipv6PublicAddrPrefix", {
            get: $util.oneOfGetter($oneOfFields = ["ipv6PublicAddrPrefix"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(RoutePeerInfo.prototype, "_ipv6PublicAddrLease", {
            get: $util.oneOfGetter($oneOfFields = ["ipv6PublicAddrLease"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified RoutePeerInfo message. Does not implicitly {@link peer_rpc.RoutePeerInfo.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.RoutePeerInfo
         * @static
         * @param {peer_rpc.RoutePeerInfo.$Properties} message RoutePeerInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoutePeerInfo.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.peerId != null && $Object.hasOwnProperty.call(message, "peerId") && message.peerId !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.peerId);
            if (message.instId != null && $Object.hasOwnProperty.call(message, "instId"))
                $root.common.UUID.encode(message.instId, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.cost != null && $Object.hasOwnProperty.call(message, "cost") && message.cost !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.cost);
            if (message.ipv4Addr != null && $Object.hasOwnProperty.call(message, "ipv4Addr"))
                $root.common.Ipv4Addr.encode(message.ipv4Addr, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.proxyCidrs != null && message.proxyCidrs.length)
                for (let i = 0; i < message.proxyCidrs.length; ++i)
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.proxyCidrs[i]);
            if (message.hostname != null && $Object.hasOwnProperty.call(message, "hostname"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.hostname);
            if (message.udpNatType != null && $Object.hasOwnProperty.call(message, "udpNatType") && message.udpNatType !== 0)
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.udpNatType);
            if (message.lastUpdate != null && $Object.hasOwnProperty.call(message, "lastUpdate"))
                $root.google.protobuf.Timestamp.encode(message.lastUpdate, writer.uint32(/* id 8, wireType 2 =*/66).fork(), _depth + 1).ldelim();
            if (message.version != null && $Object.hasOwnProperty.call(message, "version") && message.version !== 0)
                writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.version);
            if (message.easytierVersion != null && $Object.hasOwnProperty.call(message, "easytierVersion") && message.easytierVersion !== "")
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.easytierVersion);
            if (message.featureFlag != null && $Object.hasOwnProperty.call(message, "featureFlag"))
                $root.common.PeerFeatureFlag.encode(message.featureFlag, writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.peerRouteId != null && $Object.hasOwnProperty.call(message, "peerRouteId") && (typeof message.peerRouteId === "object" ? message.peerRouteId.low || message.peerRouteId.high : message.peerRouteId !== 0))
                writer.uint32(/* id 12, wireType 0 =*/96).uint64(message.peerRouteId);
            if (message.networkLength != null && $Object.hasOwnProperty.call(message, "networkLength") && message.networkLength !== 0)
                writer.uint32(/* id 13, wireType 0 =*/104).uint32(message.networkLength);
            if (message.quicPort != null && $Object.hasOwnProperty.call(message, "quicPort"))
                writer.uint32(/* id 14, wireType 0 =*/112).uint32(message.quicPort);
            if (message.ipv6Addr != null && $Object.hasOwnProperty.call(message, "ipv6Addr"))
                $root.common.Ipv6Inet.encode(message.ipv6Addr, writer.uint32(/* id 15, wireType 2 =*/122).fork(), _depth + 1).ldelim();
            if (message.groups != null && message.groups.length)
                for (let i = 0; i < message.groups.length; ++i)
                    $root.peer_rpc.PeerGroupInfo.encode(message.groups[i], writer.uint32(/* id 16, wireType 2 =*/130).fork(), _depth + 1).ldelim();
            if (message.tcpNatType != null && $Object.hasOwnProperty.call(message, "tcpNatType") && message.tcpNatType !== 0)
                writer.uint32(/* id 17, wireType 0 =*/136).int32(message.tcpNatType);
            if (message.noiseStaticPubkey != null && $Object.hasOwnProperty.call(message, "noiseStaticPubkey") && message.noiseStaticPubkey.length)
                writer.uint32(/* id 18, wireType 2 =*/146).bytes(message.noiseStaticPubkey);
            if (message.trustedCredentialPubkeys != null && message.trustedCredentialPubkeys.length)
                for (let i = 0; i < message.trustedCredentialPubkeys.length; ++i)
                    $root.peer_rpc.TrustedCredentialPubkeyProof.encode(message.trustedCredentialPubkeys[i], writer.uint32(/* id 19, wireType 2 =*/154).fork(), _depth + 1).ldelim();
            if (message.ipv6PublicAddrPrefix != null && $Object.hasOwnProperty.call(message, "ipv6PublicAddrPrefix"))
                $root.common.Ipv6Inet.encode(message.ipv6PublicAddrPrefix, writer.uint32(/* id 22, wireType 2 =*/178).fork(), _depth + 1).ldelim();
            if (message.ipv6PublicAddrLease != null && $Object.hasOwnProperty.call(message, "ipv6PublicAddrLease"))
                $root.common.Ipv6Inet.encode(message.ipv6PublicAddrLease, writer.uint32(/* id 24, wireType 2 =*/194).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RoutePeerInfo message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.RoutePeerInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.RoutePeerInfo & peer_rpc.RoutePeerInfo.$Shape} RoutePeerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoutePeerInfo.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.RoutePeerInfo(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.peerId = value;
                        else
                            delete message.peerId;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.instId = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.instId);
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.cost = value;
                        else
                            delete message.cost;
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.ipv4Addr = $root.common.Ipv4Addr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.ipv4Addr);
                        message._ipv4Addr = "ipv4Addr";
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        if (!(message.proxyCidrs && message.proxyCidrs.length))
                            message.proxyCidrs = [];
                        message.proxyCidrs.push(reader.stringVerify());
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        message.hostname = reader.stringVerify();
                        message._hostname = "hostname";
                        continue;
                    }
                case 7: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.udpNatType = value;
                        else
                            delete message.udpNatType;
                        continue;
                    }
                case 8: {
                        if (wireType !== 2)
                            break;
                        message.lastUpdate = $root.google.protobuf.Timestamp.decode(reader, reader.uint32(), $undefined, _depth + 1, message.lastUpdate);
                        continue;
                    }
                case 9: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.version = value;
                        else
                            delete message.version;
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.easytierVersion = value;
                        else
                            delete message.easytierVersion;
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        message.featureFlag = $root.common.PeerFeatureFlag.decode(reader, reader.uint32(), $undefined, _depth + 1, message.featureFlag);
                        continue;
                    }
                case 12: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.peerRouteId = value;
                        else
                            delete message.peerRouteId;
                        continue;
                    }
                case 13: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.networkLength = value;
                        else
                            delete message.networkLength;
                        continue;
                    }
                case 14: {
                        if (wireType !== 0)
                            break;
                        message.quicPort = reader.uint32();
                        message._quicPort = "quicPort";
                        continue;
                    }
                case 15: {
                        if (wireType !== 2)
                            break;
                        message.ipv6Addr = $root.common.Ipv6Inet.decode(reader, reader.uint32(), $undefined, _depth + 1, message.ipv6Addr);
                        message._ipv6Addr = "ipv6Addr";
                        continue;
                    }
                case 16: {
                        if (wireType !== 2)
                            break;
                        if (!(message.groups && message.groups.length))
                            message.groups = [];
                        message.groups.push($root.peer_rpc.PeerGroupInfo.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 17: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.tcpNatType = value;
                        else
                            delete message.tcpNatType;
                        continue;
                    }
                case 18: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.noiseStaticPubkey = value;
                        else
                            delete message.noiseStaticPubkey;
                        continue;
                    }
                case 19: {
                        if (wireType !== 2)
                            break;
                        if (!(message.trustedCredentialPubkeys && message.trustedCredentialPubkeys.length))
                            message.trustedCredentialPubkeys = [];
                        message.trustedCredentialPubkeys.push($root.peer_rpc.TrustedCredentialPubkeyProof.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 22: {
                        if (wireType !== 2)
                            break;
                        message.ipv6PublicAddrPrefix = $root.common.Ipv6Inet.decode(reader, reader.uint32(), $undefined, _depth + 1, message.ipv6PublicAddrPrefix);
                        message._ipv6PublicAddrPrefix = "ipv6PublicAddrPrefix";
                        continue;
                    }
                case 24: {
                        if (wireType !== 2)
                            break;
                        message.ipv6PublicAddrLease = $root.common.Ipv6Inet.decode(reader, reader.uint32(), $undefined, _depth + 1, message.ipv6PublicAddrLease);
                        message._ipv6PublicAddrLease = "ipv6PublicAddrLease";
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return RoutePeerInfo;
    })();

    peer_rpc.PeerIdVersion = (function() {

        /**
         * Properties of a PeerIdVersion.
         * @typedef {Object} peer_rpc.PeerIdVersion.$Properties
         * @property {number|null} [peerId] PeerIdVersion peerId
         * @property {number|null} [version] PeerIdVersion version
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a PeerIdVersion.
         * @memberof peer_rpc
         * @interface IPeerIdVersion
         * @augments peer_rpc.PeerIdVersion.$Properties
         * @deprecated Use peer_rpc.PeerIdVersion.$Properties instead.
         */

        /**
         * Shape of a PeerIdVersion.
         * @typedef {peer_rpc.PeerIdVersion.$Properties} peer_rpc.PeerIdVersion.$Shape
         */

        /**
         * Constructs a new PeerIdVersion.
         * @memberof peer_rpc
         * @classdesc Represents a PeerIdVersion.
         * @constructor
         * @param {peer_rpc.PeerIdVersion.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const PeerIdVersion = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * PeerIdVersion peerId.
         * @member {number} peerId
         * @memberof peer_rpc.PeerIdVersion
         * @instance
         */
        PeerIdVersion.prototype.peerId = 0;

        /**
         * PeerIdVersion version.
         * @member {number} version
         * @memberof peer_rpc.PeerIdVersion
         * @instance
         */
        PeerIdVersion.prototype.version = 0;

        /**
         * Encodes the specified PeerIdVersion message. Does not implicitly {@link peer_rpc.PeerIdVersion.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.PeerIdVersion
         * @static
         * @param {peer_rpc.PeerIdVersion.$Properties} message PeerIdVersion message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PeerIdVersion.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.peerId != null && $Object.hasOwnProperty.call(message, "peerId") && message.peerId !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.peerId);
            if (message.version != null && $Object.hasOwnProperty.call(message, "version") && message.version !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.version);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a PeerIdVersion message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.PeerIdVersion
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.PeerIdVersion & peer_rpc.PeerIdVersion.$Shape} PeerIdVersion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PeerIdVersion.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.PeerIdVersion(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.peerId = value;
                        else
                            delete message.peerId;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.version = value;
                        else
                            delete message.version;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return PeerIdVersion;
    })();

    peer_rpc.RouteConnBitmap = (function() {

        /**
         * Properties of a RouteConnBitmap.
         * @typedef {Object} peer_rpc.RouteConnBitmap.$Properties
         * @property {Array.<peer_rpc.PeerIdVersion.$Properties>|null} [peerIds] RouteConnBitmap peerIds
         * @property {Uint8Array|null} [bitmap] RouteConnBitmap bitmap
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RouteConnBitmap.
         * @memberof peer_rpc
         * @interface IRouteConnBitmap
         * @augments peer_rpc.RouteConnBitmap.$Properties
         * @deprecated Use peer_rpc.RouteConnBitmap.$Properties instead.
         */

        /**
         * Shape of a RouteConnBitmap.
         * @typedef {peer_rpc.RouteConnBitmap.$Properties} peer_rpc.RouteConnBitmap.$Shape
         */

        /**
         * Constructs a new RouteConnBitmap.
         * @memberof peer_rpc
         * @classdesc Represents a RouteConnBitmap.
         * @constructor
         * @param {peer_rpc.RouteConnBitmap.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RouteConnBitmap = function (properties) {
            this.peerIds = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RouteConnBitmap peerIds.
         * @member {Array.<peer_rpc.PeerIdVersion.$Properties>} peerIds
         * @memberof peer_rpc.RouteConnBitmap
         * @instance
         */
        RouteConnBitmap.prototype.peerIds = $util.emptyArray;

        /**
         * RouteConnBitmap bitmap.
         * @member {Uint8Array} bitmap
         * @memberof peer_rpc.RouteConnBitmap
         * @instance
         */
        RouteConnBitmap.prototype.bitmap = $util.newBuffer([]);

        /**
         * Encodes the specified RouteConnBitmap message. Does not implicitly {@link peer_rpc.RouteConnBitmap.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.RouteConnBitmap
         * @static
         * @param {peer_rpc.RouteConnBitmap.$Properties} message RouteConnBitmap message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RouteConnBitmap.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.peerIds != null && message.peerIds.length)
                for (let i = 0; i < message.peerIds.length; ++i)
                    $root.peer_rpc.PeerIdVersion.encode(message.peerIds[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.bitmap != null && $Object.hasOwnProperty.call(message, "bitmap") && message.bitmap.length)
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.bitmap);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RouteConnBitmap message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.RouteConnBitmap
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.RouteConnBitmap & peer_rpc.RouteConnBitmap.$Shape} RouteConnBitmap
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RouteConnBitmap.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.RouteConnBitmap(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (!(message.peerIds && message.peerIds.length))
                            message.peerIds = [];
                        message.peerIds.push($root.peer_rpc.PeerIdVersion.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.bitmap = value;
                        else
                            delete message.bitmap;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return RouteConnBitmap;
    })();

    peer_rpc.RouteConnPeerList = (function() {

        /**
         * Properties of a RouteConnPeerList.
         * @typedef {Object} peer_rpc.RouteConnPeerList.$Properties
         * @property {Array.<peer_rpc.RouteConnPeerList.PeerConnInfo.$Properties>|null} [peerConnInfos] RouteConnPeerList peerConnInfos
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RouteConnPeerList.
         * @memberof peer_rpc
         * @interface IRouteConnPeerList
         * @augments peer_rpc.RouteConnPeerList.$Properties
         * @deprecated Use peer_rpc.RouteConnPeerList.$Properties instead.
         */

        /**
         * Shape of a RouteConnPeerList.
         * @typedef {peer_rpc.RouteConnPeerList.$Properties} peer_rpc.RouteConnPeerList.$Shape
         */

        /**
         * Constructs a new RouteConnPeerList.
         * @memberof peer_rpc
         * @classdesc Represents a RouteConnPeerList.
         * @constructor
         * @param {peer_rpc.RouteConnPeerList.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RouteConnPeerList = function (properties) {
            this.peerConnInfos = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RouteConnPeerList peerConnInfos.
         * @member {Array.<peer_rpc.RouteConnPeerList.PeerConnInfo.$Properties>} peerConnInfos
         * @memberof peer_rpc.RouteConnPeerList
         * @instance
         */
        RouteConnPeerList.prototype.peerConnInfos = $util.emptyArray;

        /**
         * Encodes the specified RouteConnPeerList message. Does not implicitly {@link peer_rpc.RouteConnPeerList.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.RouteConnPeerList
         * @static
         * @param {peer_rpc.RouteConnPeerList.$Properties} message RouteConnPeerList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RouteConnPeerList.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.peerConnInfos != null && message.peerConnInfos.length)
                for (let i = 0; i < message.peerConnInfos.length; ++i)
                    $root.peer_rpc.RouteConnPeerList.PeerConnInfo.encode(message.peerConnInfos[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RouteConnPeerList message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.RouteConnPeerList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.RouteConnPeerList & peer_rpc.RouteConnPeerList.$Shape} RouteConnPeerList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RouteConnPeerList.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.RouteConnPeerList();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (!(message.peerConnInfos && message.peerConnInfos.length))
                            message.peerConnInfos = [];
                        message.peerConnInfos.push($root.peer_rpc.RouteConnPeerList.PeerConnInfo.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        RouteConnPeerList.PeerConnInfo = (function() {

            /**
             * Properties of a PeerConnInfo.
             * @typedef {Object} peer_rpc.RouteConnPeerList.PeerConnInfo.$Properties
             * @property {peer_rpc.PeerIdVersion.$Properties|null} [peerId] PeerConnInfo peerId
             * @property {Array.<number>|null} [connectedPeerIds] PeerConnInfo connectedPeerIds
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a PeerConnInfo.
             * @memberof peer_rpc.RouteConnPeerList
             * @interface IPeerConnInfo
             * @augments peer_rpc.RouteConnPeerList.PeerConnInfo.$Properties
             * @deprecated Use peer_rpc.RouteConnPeerList.PeerConnInfo.$Properties instead.
             */

            /**
             * Shape of a PeerConnInfo.
             * @typedef {peer_rpc.RouteConnPeerList.PeerConnInfo.$Properties} peer_rpc.RouteConnPeerList.PeerConnInfo.$Shape
             */

            /**
             * Constructs a new PeerConnInfo.
             * @memberof peer_rpc.RouteConnPeerList
             * @classdesc Represents a PeerConnInfo.
             * @constructor
             * @param {peer_rpc.RouteConnPeerList.PeerConnInfo.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const PeerConnInfo = function (properties) {
                this.connectedPeerIds = [];
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * PeerConnInfo peerId.
             * @member {peer_rpc.PeerIdVersion.$Properties|null|undefined} peerId
             * @memberof peer_rpc.RouteConnPeerList.PeerConnInfo
             * @instance
             */
            PeerConnInfo.prototype.peerId = null;

            /**
             * PeerConnInfo connectedPeerIds.
             * @member {Array.<number>} connectedPeerIds
             * @memberof peer_rpc.RouteConnPeerList.PeerConnInfo
             * @instance
             */
            PeerConnInfo.prototype.connectedPeerIds = $util.emptyArray;

            /**
             * Encodes the specified PeerConnInfo message. Does not implicitly {@link peer_rpc.RouteConnPeerList.PeerConnInfo.verify|verify} messages.
             * @function encode
             * @memberof peer_rpc.RouteConnPeerList.PeerConnInfo
             * @static
             * @param {peer_rpc.RouteConnPeerList.PeerConnInfo.$Properties} message PeerConnInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PeerConnInfo.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.peerId != null && $Object.hasOwnProperty.call(message, "peerId"))
                    $root.peer_rpc.PeerIdVersion.encode(message.peerId, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                if (message.connectedPeerIds != null && message.connectedPeerIds.length)
                    writer.uint32(/* id 2, wireType 2 =*/18).uint32s(message.connectedPeerIds);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Decodes a PeerConnInfo message from the specified reader or buffer.
             * @function decode
             * @memberof peer_rpc.RouteConnPeerList.PeerConnInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {peer_rpc.RouteConnPeerList.PeerConnInfo & peer_rpc.RouteConnPeerList.PeerConnInfo.$Shape} PeerConnInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PeerConnInfo.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.RouteConnPeerList.PeerConnInfo(), value;
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.peerId = $root.peer_rpc.PeerIdVersion.decode(reader, reader.uint32(), $undefined, _depth + 1, message.peerId);
                            continue;
                        }
                    case 2: {
                            if (wireType === 2) {
                                if (!(message.connectedPeerIds && message.connectedPeerIds.length))
                                    message.connectedPeerIds = [];
                                reader.uint32s(message.connectedPeerIds);
                                continue;
                            }
                            if (wireType !== 0)
                                break;
                            if (!(message.connectedPeerIds && message.connectedPeerIds.length))
                                message.connectedPeerIds = [];
                            message.connectedPeerIds.push(reader.uint32());
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            return PeerConnInfo;
        })();

        return RouteConnPeerList;
    })();

    peer_rpc.RoutePeerInfos = (function() {

        /**
         * Properties of a RoutePeerInfos.
         * @typedef {Object} peer_rpc.RoutePeerInfos.$Properties
         * @property {Array.<peer_rpc.RoutePeerInfo.$Properties>|null} [items] RoutePeerInfos items
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RoutePeerInfos.
         * @memberof peer_rpc
         * @interface IRoutePeerInfos
         * @augments peer_rpc.RoutePeerInfos.$Properties
         * @deprecated Use peer_rpc.RoutePeerInfos.$Properties instead.
         */

        /**
         * Shape of a RoutePeerInfos.
         * @typedef {peer_rpc.RoutePeerInfos.$Properties} peer_rpc.RoutePeerInfos.$Shape
         */

        /**
         * Constructs a new RoutePeerInfos.
         * @memberof peer_rpc
         * @classdesc Represents a RoutePeerInfos.
         * @constructor
         * @param {peer_rpc.RoutePeerInfos.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RoutePeerInfos = function (properties) {
            this.items = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RoutePeerInfos items.
         * @member {Array.<peer_rpc.RoutePeerInfo.$Properties>} items
         * @memberof peer_rpc.RoutePeerInfos
         * @instance
         */
        RoutePeerInfos.prototype.items = $util.emptyArray;

        /**
         * Encodes the specified RoutePeerInfos message. Does not implicitly {@link peer_rpc.RoutePeerInfos.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.RoutePeerInfos
         * @static
         * @param {peer_rpc.RoutePeerInfos.$Properties} message RoutePeerInfos message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoutePeerInfos.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.items != null && message.items.length)
                for (let i = 0; i < message.items.length; ++i)
                    $root.peer_rpc.RoutePeerInfo.encode(message.items[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RoutePeerInfos message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.RoutePeerInfos
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.RoutePeerInfos & peer_rpc.RoutePeerInfos.$Shape} RoutePeerInfos
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoutePeerInfos.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.RoutePeerInfos();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (!(message.items && message.items.length))
                            message.items = [];
                        message.items.push($root.peer_rpc.RoutePeerInfo.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return RoutePeerInfos;
    })();

    peer_rpc.ForeignNetworkRouteInfoKey = (function() {

        /**
         * Properties of a ForeignNetworkRouteInfoKey.
         * @typedef {Object} peer_rpc.ForeignNetworkRouteInfoKey.$Properties
         * @property {number|null} [peerId] ForeignNetworkRouteInfoKey peerId
         * @property {string|null} [networkName] ForeignNetworkRouteInfoKey networkName
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a ForeignNetworkRouteInfoKey.
         * @memberof peer_rpc
         * @interface IForeignNetworkRouteInfoKey
         * @augments peer_rpc.ForeignNetworkRouteInfoKey.$Properties
         * @deprecated Use peer_rpc.ForeignNetworkRouteInfoKey.$Properties instead.
         */

        /**
         * Shape of a ForeignNetworkRouteInfoKey.
         * @typedef {peer_rpc.ForeignNetworkRouteInfoKey.$Properties} peer_rpc.ForeignNetworkRouteInfoKey.$Shape
         */

        /**
         * Constructs a new ForeignNetworkRouteInfoKey.
         * @memberof peer_rpc
         * @classdesc Represents a ForeignNetworkRouteInfoKey.
         * @constructor
         * @param {peer_rpc.ForeignNetworkRouteInfoKey.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const ForeignNetworkRouteInfoKey = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * ForeignNetworkRouteInfoKey peerId.
         * @member {number} peerId
         * @memberof peer_rpc.ForeignNetworkRouteInfoKey
         * @instance
         */
        ForeignNetworkRouteInfoKey.prototype.peerId = 0;

        /**
         * ForeignNetworkRouteInfoKey networkName.
         * @member {string} networkName
         * @memberof peer_rpc.ForeignNetworkRouteInfoKey
         * @instance
         */
        ForeignNetworkRouteInfoKey.prototype.networkName = "";

        /**
         * Encodes the specified ForeignNetworkRouteInfoKey message. Does not implicitly {@link peer_rpc.ForeignNetworkRouteInfoKey.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.ForeignNetworkRouteInfoKey
         * @static
         * @param {peer_rpc.ForeignNetworkRouteInfoKey.$Properties} message ForeignNetworkRouteInfoKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ForeignNetworkRouteInfoKey.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.peerId != null && $Object.hasOwnProperty.call(message, "peerId") && message.peerId !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.peerId);
            if (message.networkName != null && $Object.hasOwnProperty.call(message, "networkName") && message.networkName !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.networkName);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a ForeignNetworkRouteInfoKey message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.ForeignNetworkRouteInfoKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.ForeignNetworkRouteInfoKey & peer_rpc.ForeignNetworkRouteInfoKey.$Shape} ForeignNetworkRouteInfoKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ForeignNetworkRouteInfoKey.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.ForeignNetworkRouteInfoKey(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.peerId = value;
                        else
                            delete message.peerId;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.networkName = value;
                        else
                            delete message.networkName;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return ForeignNetworkRouteInfoKey;
    })();

    peer_rpc.ForeignNetworkRouteInfoEntry = (function() {

        /**
         * Properties of a ForeignNetworkRouteInfoEntry.
         * @typedef {Object} peer_rpc.ForeignNetworkRouteInfoEntry.$Properties
         * @property {Array.<number>|null} [foreignPeerIds] ForeignNetworkRouteInfoEntry foreignPeerIds
         * @property {google.protobuf.Timestamp.$Properties|null} [lastUpdate] ForeignNetworkRouteInfoEntry lastUpdate
         * @property {number|null} [version] ForeignNetworkRouteInfoEntry version
         * @property {Uint8Array|null} [networkSecretDigest] ForeignNetworkRouteInfoEntry networkSecretDigest
         * @property {number|null} [myPeerIdForThisNetwork] ForeignNetworkRouteInfoEntry myPeerIdForThisNetwork
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a ForeignNetworkRouteInfoEntry.
         * @memberof peer_rpc
         * @interface IForeignNetworkRouteInfoEntry
         * @augments peer_rpc.ForeignNetworkRouteInfoEntry.$Properties
         * @deprecated Use peer_rpc.ForeignNetworkRouteInfoEntry.$Properties instead.
         */

        /**
         * Shape of a ForeignNetworkRouteInfoEntry.
         * @typedef {peer_rpc.ForeignNetworkRouteInfoEntry.$Properties} peer_rpc.ForeignNetworkRouteInfoEntry.$Shape
         */

        /**
         * Constructs a new ForeignNetworkRouteInfoEntry.
         * @memberof peer_rpc
         * @classdesc Represents a ForeignNetworkRouteInfoEntry.
         * @constructor
         * @param {peer_rpc.ForeignNetworkRouteInfoEntry.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const ForeignNetworkRouteInfoEntry = function (properties) {
            this.foreignPeerIds = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * ForeignNetworkRouteInfoEntry foreignPeerIds.
         * @member {Array.<number>} foreignPeerIds
         * @memberof peer_rpc.ForeignNetworkRouteInfoEntry
         * @instance
         */
        ForeignNetworkRouteInfoEntry.prototype.foreignPeerIds = $util.emptyArray;

        /**
         * ForeignNetworkRouteInfoEntry lastUpdate.
         * @member {google.protobuf.Timestamp.$Properties|null|undefined} lastUpdate
         * @memberof peer_rpc.ForeignNetworkRouteInfoEntry
         * @instance
         */
        ForeignNetworkRouteInfoEntry.prototype.lastUpdate = null;

        /**
         * ForeignNetworkRouteInfoEntry version.
         * @member {number} version
         * @memberof peer_rpc.ForeignNetworkRouteInfoEntry
         * @instance
         */
        ForeignNetworkRouteInfoEntry.prototype.version = 0;

        /**
         * ForeignNetworkRouteInfoEntry networkSecretDigest.
         * @member {Uint8Array} networkSecretDigest
         * @memberof peer_rpc.ForeignNetworkRouteInfoEntry
         * @instance
         */
        ForeignNetworkRouteInfoEntry.prototype.networkSecretDigest = $util.newBuffer([]);

        /**
         * ForeignNetworkRouteInfoEntry myPeerIdForThisNetwork.
         * @member {number} myPeerIdForThisNetwork
         * @memberof peer_rpc.ForeignNetworkRouteInfoEntry
         * @instance
         */
        ForeignNetworkRouteInfoEntry.prototype.myPeerIdForThisNetwork = 0;

        /**
         * Encodes the specified ForeignNetworkRouteInfoEntry message. Does not implicitly {@link peer_rpc.ForeignNetworkRouteInfoEntry.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.ForeignNetworkRouteInfoEntry
         * @static
         * @param {peer_rpc.ForeignNetworkRouteInfoEntry.$Properties} message ForeignNetworkRouteInfoEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ForeignNetworkRouteInfoEntry.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.foreignPeerIds != null && message.foreignPeerIds.length)
                writer.uint32(/* id 1, wireType 2 =*/10).uint32s(message.foreignPeerIds);
            if (message.lastUpdate != null && $Object.hasOwnProperty.call(message, "lastUpdate"))
                $root.google.protobuf.Timestamp.encode(message.lastUpdate, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.version != null && $Object.hasOwnProperty.call(message, "version") && message.version !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.version);
            if (message.networkSecretDigest != null && $Object.hasOwnProperty.call(message, "networkSecretDigest") && message.networkSecretDigest.length)
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.networkSecretDigest);
            if (message.myPeerIdForThisNetwork != null && $Object.hasOwnProperty.call(message, "myPeerIdForThisNetwork") && message.myPeerIdForThisNetwork !== 0)
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.myPeerIdForThisNetwork);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a ForeignNetworkRouteInfoEntry message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.ForeignNetworkRouteInfoEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.ForeignNetworkRouteInfoEntry & peer_rpc.ForeignNetworkRouteInfoEntry.$Shape} ForeignNetworkRouteInfoEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ForeignNetworkRouteInfoEntry.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.ForeignNetworkRouteInfoEntry(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType === 2) {
                            if (!(message.foreignPeerIds && message.foreignPeerIds.length))
                                message.foreignPeerIds = [];
                            reader.uint32s(message.foreignPeerIds);
                            continue;
                        }
                        if (wireType !== 0)
                            break;
                        if (!(message.foreignPeerIds && message.foreignPeerIds.length))
                            message.foreignPeerIds = [];
                        message.foreignPeerIds.push(reader.uint32());
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.lastUpdate = $root.google.protobuf.Timestamp.decode(reader, reader.uint32(), $undefined, _depth + 1, message.lastUpdate);
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.version = value;
                        else
                            delete message.version;
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.networkSecretDigest = value;
                        else
                            delete message.networkSecretDigest;
                        continue;
                    }
                case 5: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.myPeerIdForThisNetwork = value;
                        else
                            delete message.myPeerIdForThisNetwork;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return ForeignNetworkRouteInfoEntry;
    })();

    peer_rpc.RouteForeignNetworkInfos = (function() {

        /**
         * Properties of a RouteForeignNetworkInfos.
         * @typedef {Object} peer_rpc.RouteForeignNetworkInfos.$Properties
         * @property {Array.<peer_rpc.RouteForeignNetworkInfos.Info.$Properties>|null} [infos] RouteForeignNetworkInfos infos
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RouteForeignNetworkInfos.
         * @memberof peer_rpc
         * @interface IRouteForeignNetworkInfos
         * @augments peer_rpc.RouteForeignNetworkInfos.$Properties
         * @deprecated Use peer_rpc.RouteForeignNetworkInfos.$Properties instead.
         */

        /**
         * Shape of a RouteForeignNetworkInfos.
         * @typedef {peer_rpc.RouteForeignNetworkInfos.$Properties} peer_rpc.RouteForeignNetworkInfos.$Shape
         */

        /**
         * Constructs a new RouteForeignNetworkInfos.
         * @memberof peer_rpc
         * @classdesc Represents a RouteForeignNetworkInfos.
         * @constructor
         * @param {peer_rpc.RouteForeignNetworkInfos.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RouteForeignNetworkInfos = function (properties) {
            this.infos = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RouteForeignNetworkInfos infos.
         * @member {Array.<peer_rpc.RouteForeignNetworkInfos.Info.$Properties>} infos
         * @memberof peer_rpc.RouteForeignNetworkInfos
         * @instance
         */
        RouteForeignNetworkInfos.prototype.infos = $util.emptyArray;

        /**
         * Encodes the specified RouteForeignNetworkInfos message. Does not implicitly {@link peer_rpc.RouteForeignNetworkInfos.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.RouteForeignNetworkInfos
         * @static
         * @param {peer_rpc.RouteForeignNetworkInfos.$Properties} message RouteForeignNetworkInfos message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RouteForeignNetworkInfos.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.infos != null && message.infos.length)
                for (let i = 0; i < message.infos.length; ++i)
                    $root.peer_rpc.RouteForeignNetworkInfos.Info.encode(message.infos[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RouteForeignNetworkInfos message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.RouteForeignNetworkInfos
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.RouteForeignNetworkInfos & peer_rpc.RouteForeignNetworkInfos.$Shape} RouteForeignNetworkInfos
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RouteForeignNetworkInfos.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.RouteForeignNetworkInfos();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (!(message.infos && message.infos.length))
                            message.infos = [];
                        message.infos.push($root.peer_rpc.RouteForeignNetworkInfos.Info.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        RouteForeignNetworkInfos.Info = (function() {

            /**
             * Properties of an Info.
             * @typedef {Object} peer_rpc.RouteForeignNetworkInfos.Info.$Properties
             * @property {peer_rpc.ForeignNetworkRouteInfoKey.$Properties|null} [key] Info key
             * @property {peer_rpc.ForeignNetworkRouteInfoEntry.$Properties|null} [value] Info value
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an Info.
             * @memberof peer_rpc.RouteForeignNetworkInfos
             * @interface IInfo
             * @augments peer_rpc.RouteForeignNetworkInfos.Info.$Properties
             * @deprecated Use peer_rpc.RouteForeignNetworkInfos.Info.$Properties instead.
             */

            /**
             * Shape of an Info.
             * @typedef {peer_rpc.RouteForeignNetworkInfos.Info.$Properties} peer_rpc.RouteForeignNetworkInfos.Info.$Shape
             */

            /**
             * Constructs a new Info.
             * @memberof peer_rpc.RouteForeignNetworkInfos
             * @classdesc Represents an Info.
             * @constructor
             * @param {peer_rpc.RouteForeignNetworkInfos.Info.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const Info = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Info key.
             * @member {peer_rpc.ForeignNetworkRouteInfoKey.$Properties|null|undefined} key
             * @memberof peer_rpc.RouteForeignNetworkInfos.Info
             * @instance
             */
            Info.prototype.key = null;

            /**
             * Info value.
             * @member {peer_rpc.ForeignNetworkRouteInfoEntry.$Properties|null|undefined} value
             * @memberof peer_rpc.RouteForeignNetworkInfos.Info
             * @instance
             */
            Info.prototype.value = null;

            /**
             * Encodes the specified Info message. Does not implicitly {@link peer_rpc.RouteForeignNetworkInfos.Info.verify|verify} messages.
             * @function encode
             * @memberof peer_rpc.RouteForeignNetworkInfos.Info
             * @static
             * @param {peer_rpc.RouteForeignNetworkInfos.Info.$Properties} message Info message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Info.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                    $root.peer_rpc.ForeignNetworkRouteInfoKey.encode(message.key, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                if (message.value != null && $Object.hasOwnProperty.call(message, "value"))
                    $root.peer_rpc.ForeignNetworkRouteInfoEntry.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Decodes an Info message from the specified reader or buffer.
             * @function decode
             * @memberof peer_rpc.RouteForeignNetworkInfos.Info
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {peer_rpc.RouteForeignNetworkInfos.Info & peer_rpc.RouteForeignNetworkInfos.Info.$Shape} Info
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Info.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.RouteForeignNetworkInfos.Info(), value;
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.key = $root.peer_rpc.ForeignNetworkRouteInfoKey.decode(reader, reader.uint32(), $undefined, _depth + 1, message.key);
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.value = $root.peer_rpc.ForeignNetworkRouteInfoEntry.decode(reader, reader.uint32(), $undefined, _depth + 1, message.value);
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            return Info;
        })();

        return RouteForeignNetworkInfos;
    })();

    peer_rpc.RouteForeignNetworkSummary = (function() {

        /**
         * Properties of a RouteForeignNetworkSummary.
         * @typedef {Object} peer_rpc.RouteForeignNetworkSummary.$Properties
         * @property {Object.<string,peer_rpc.RouteForeignNetworkSummary.Info.$Properties>|null} [infoMap] RouteForeignNetworkSummary infoMap
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RouteForeignNetworkSummary.
         * @memberof peer_rpc
         * @interface IRouteForeignNetworkSummary
         * @augments peer_rpc.RouteForeignNetworkSummary.$Properties
         * @deprecated Use peer_rpc.RouteForeignNetworkSummary.$Properties instead.
         */

        /**
         * Shape of a RouteForeignNetworkSummary.
         * @typedef {peer_rpc.RouteForeignNetworkSummary.$Properties} peer_rpc.RouteForeignNetworkSummary.$Shape
         */

        /**
         * Constructs a new RouteForeignNetworkSummary.
         * @memberof peer_rpc
         * @classdesc Represents a RouteForeignNetworkSummary.
         * @constructor
         * @param {peer_rpc.RouteForeignNetworkSummary.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RouteForeignNetworkSummary = function (properties) {
            this.infoMap = {};
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RouteForeignNetworkSummary infoMap.
         * @member {Object.<string,peer_rpc.RouteForeignNetworkSummary.Info.$Properties>} infoMap
         * @memberof peer_rpc.RouteForeignNetworkSummary
         * @instance
         */
        RouteForeignNetworkSummary.prototype.infoMap = $util.emptyObject;

        /**
         * Encodes the specified RouteForeignNetworkSummary message. Does not implicitly {@link peer_rpc.RouteForeignNetworkSummary.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.RouteForeignNetworkSummary
         * @static
         * @param {peer_rpc.RouteForeignNetworkSummary.$Properties} message RouteForeignNetworkSummary message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RouteForeignNetworkSummary.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.infoMap != null && $Object.hasOwnProperty.call(message, "infoMap"))
                for (let keys = $Object.keys(message.infoMap), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 0 =*/8).uint32(keys[i]);
                    $root.peer_rpc.RouteForeignNetworkSummary.Info.encode(message.infoMap[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim().ldelim();
                }
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RouteForeignNetworkSummary message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.RouteForeignNetworkSummary
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.RouteForeignNetworkSummary & peer_rpc.RouteForeignNetworkSummary.$Shape} RouteForeignNetworkSummary
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RouteForeignNetworkSummary.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.RouteForeignNetworkSummary(), key, value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (message.infoMap === $util.emptyObject)
                            message.infoMap = {};
                        let end2 = reader.uint32() + reader.pos;
                        key = 0;
                        value = null;
                        while (reader.pos < end2) {
                            let tag2 = reader.tag();
                            wireType = tag2 & 7;
                            switch (tag2 >>>= 3) {
                            case 1:
                                if (wireType !== 0)
                                    break;
                                key = reader.uint32();
                                continue;
                            case 2:
                                if (wireType !== 2)
                                    break;
                                value = $root.peer_rpc.RouteForeignNetworkSummary.Info.decode(reader, reader.uint32(), $undefined, _depth + 1, value);
                                continue;
                            }
                            reader.skipType(wireType, _depth, tag2);
                        }
                        message.infoMap[key] = value || new $root.peer_rpc.RouteForeignNetworkSummary.Info();
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        RouteForeignNetworkSummary.Info = (function() {

            /**
             * Properties of an Info.
             * @typedef {Object} peer_rpc.RouteForeignNetworkSummary.Info.$Properties
             * @property {number|null} [peerId] Info peerId
             * @property {number|null} [networkCount] Info networkCount
             * @property {number|null} [peerCount] Info peerCount
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an Info.
             * @memberof peer_rpc.RouteForeignNetworkSummary
             * @interface IInfo
             * @augments peer_rpc.RouteForeignNetworkSummary.Info.$Properties
             * @deprecated Use peer_rpc.RouteForeignNetworkSummary.Info.$Properties instead.
             */

            /**
             * Shape of an Info.
             * @typedef {peer_rpc.RouteForeignNetworkSummary.Info.$Properties} peer_rpc.RouteForeignNetworkSummary.Info.$Shape
             */

            /**
             * Constructs a new Info.
             * @memberof peer_rpc.RouteForeignNetworkSummary
             * @classdesc Represents an Info.
             * @constructor
             * @param {peer_rpc.RouteForeignNetworkSummary.Info.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const Info = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Info peerId.
             * @member {number} peerId
             * @memberof peer_rpc.RouteForeignNetworkSummary.Info
             * @instance
             */
            Info.prototype.peerId = 0;

            /**
             * Info networkCount.
             * @member {number} networkCount
             * @memberof peer_rpc.RouteForeignNetworkSummary.Info
             * @instance
             */
            Info.prototype.networkCount = 0;

            /**
             * Info peerCount.
             * @member {number} peerCount
             * @memberof peer_rpc.RouteForeignNetworkSummary.Info
             * @instance
             */
            Info.prototype.peerCount = 0;

            /**
             * Encodes the specified Info message. Does not implicitly {@link peer_rpc.RouteForeignNetworkSummary.Info.verify|verify} messages.
             * @function encode
             * @memberof peer_rpc.RouteForeignNetworkSummary.Info
             * @static
             * @param {peer_rpc.RouteForeignNetworkSummary.Info.$Properties} message Info message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Info.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.peerId != null && $Object.hasOwnProperty.call(message, "peerId") && message.peerId !== 0)
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.peerId);
                if (message.networkCount != null && $Object.hasOwnProperty.call(message, "networkCount") && message.networkCount !== 0)
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.networkCount);
                if (message.peerCount != null && $Object.hasOwnProperty.call(message, "peerCount") && message.peerCount !== 0)
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.peerCount);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Decodes an Info message from the specified reader or buffer.
             * @function decode
             * @memberof peer_rpc.RouteForeignNetworkSummary.Info
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {peer_rpc.RouteForeignNetworkSummary.Info & peer_rpc.RouteForeignNetworkSummary.Info.$Shape} Info
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Info.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.RouteForeignNetworkSummary.Info(), value;
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.uint32())
                                message.peerId = value;
                            else
                                delete message.peerId;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.uint32())
                                message.networkCount = value;
                            else
                                delete message.networkCount;
                            continue;
                        }
                    case 3: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.uint32())
                                message.peerCount = value;
                            else
                                delete message.peerCount;
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            return Info;
        })();

        return RouteForeignNetworkSummary;
    })();

    peer_rpc.PeerGroupInfo = (function() {

        /**
         * Properties of a PeerGroupInfo.
         * @typedef {Object} peer_rpc.PeerGroupInfo.$Properties
         * @property {string|null} [groupName] PeerGroupInfo groupName
         * @property {Uint8Array|null} [groupProof] PeerGroupInfo groupProof
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a PeerGroupInfo.
         * @memberof peer_rpc
         * @interface IPeerGroupInfo
         * @augments peer_rpc.PeerGroupInfo.$Properties
         * @deprecated Use peer_rpc.PeerGroupInfo.$Properties instead.
         */

        /**
         * Shape of a PeerGroupInfo.
         * @typedef {peer_rpc.PeerGroupInfo.$Properties} peer_rpc.PeerGroupInfo.$Shape
         */

        /**
         * Constructs a new PeerGroupInfo.
         * @memberof peer_rpc
         * @classdesc Represents a PeerGroupInfo.
         * @constructor
         * @param {peer_rpc.PeerGroupInfo.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const PeerGroupInfo = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * PeerGroupInfo groupName.
         * @member {string} groupName
         * @memberof peer_rpc.PeerGroupInfo
         * @instance
         */
        PeerGroupInfo.prototype.groupName = "";

        /**
         * PeerGroupInfo groupProof.
         * @member {Uint8Array} groupProof
         * @memberof peer_rpc.PeerGroupInfo
         * @instance
         */
        PeerGroupInfo.prototype.groupProof = $util.newBuffer([]);

        /**
         * Encodes the specified PeerGroupInfo message. Does not implicitly {@link peer_rpc.PeerGroupInfo.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.PeerGroupInfo
         * @static
         * @param {peer_rpc.PeerGroupInfo.$Properties} message PeerGroupInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PeerGroupInfo.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.groupName != null && $Object.hasOwnProperty.call(message, "groupName") && message.groupName !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.groupName);
            if (message.groupProof != null && $Object.hasOwnProperty.call(message, "groupProof") && message.groupProof.length)
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.groupProof);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a PeerGroupInfo message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.PeerGroupInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.PeerGroupInfo & peer_rpc.PeerGroupInfo.$Shape} PeerGroupInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PeerGroupInfo.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.PeerGroupInfo(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.groupName = value;
                        else
                            delete message.groupName;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.groupProof = value;
                        else
                            delete message.groupProof;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return PeerGroupInfo;
    })();

    peer_rpc.SyncRouteInfoRequest = (function() {

        /**
         * Properties of a SyncRouteInfoRequest.
         * @typedef {Object} peer_rpc.SyncRouteInfoRequest.$Properties
         * @property {number|null} [myPeerId] SyncRouteInfoRequest myPeerId
         * @property {Long|null} [mySessionId] SyncRouteInfoRequest mySessionId
         * @property {boolean|null} [isInitiator] SyncRouteInfoRequest isInitiator
         * @property {peer_rpc.RoutePeerInfos.$Properties|null} [peerInfos] SyncRouteInfoRequest peerInfos
         * @property {peer_rpc.RouteConnBitmap.$Properties|null} [connBitmap] SyncRouteInfoRequest connBitmap
         * @property {peer_rpc.RouteConnPeerList.$Properties|null} [connPeerList] SyncRouteInfoRequest connPeerList
         * @property {peer_rpc.RouteForeignNetworkInfos.$Properties|null} [foreignNetworkInfos] SyncRouteInfoRequest foreignNetworkInfos
         * @property {"connBitmap"|"connPeerList"} [connInfo] SyncRouteInfoRequest connInfo
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a SyncRouteInfoRequest.
         * @memberof peer_rpc
         * @interface ISyncRouteInfoRequest
         * @augments peer_rpc.SyncRouteInfoRequest.$Properties
         * @deprecated Use peer_rpc.SyncRouteInfoRequest.$Properties instead.
         */

        /**
         * Narrowed shape of a SyncRouteInfoRequest.
         * @typedef {{
         *   myPeerId?: number|null;
         *   mySessionId?: Long|null;
         *   isInitiator?: boolean|null;
         *   peerInfos?: peer_rpc.RoutePeerInfos.$Shape|null;
         *   connBitmap?: peer_rpc.RouteConnBitmap.$Shape|null;
         *   connPeerList?: peer_rpc.RouteConnPeerList.$Shape|null;
         *   foreignNetworkInfos?: peer_rpc.RouteForeignNetworkInfos.$Shape|null;
         *   $unknowns?: Array.<Uint8Array>;
         * } & (
         *   ({ connInfo?: undefined; connBitmap?: null; connPeerList?: null }|{ connInfo?: "connBitmap"; connBitmap: peer_rpc.RouteConnBitmap.$Shape; connPeerList?: null }|{ connInfo?: "connPeerList"; connBitmap?: null; connPeerList: peer_rpc.RouteConnPeerList.$Shape })
         * )} peer_rpc.SyncRouteInfoRequest.$Shape
         */

        /**
         * Constructs a new SyncRouteInfoRequest.
         * @memberof peer_rpc
         * @classdesc Represents a SyncRouteInfoRequest.
         * @constructor
         * @param {peer_rpc.SyncRouteInfoRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const SyncRouteInfoRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * SyncRouteInfoRequest myPeerId.
         * @member {number} myPeerId
         * @memberof peer_rpc.SyncRouteInfoRequest
         * @instance
         */
        SyncRouteInfoRequest.prototype.myPeerId = 0;

        /**
         * SyncRouteInfoRequest mySessionId.
         * @member {Long} mySessionId
         * @memberof peer_rpc.SyncRouteInfoRequest
         * @instance
         */
        SyncRouteInfoRequest.prototype.mySessionId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * SyncRouteInfoRequest isInitiator.
         * @member {boolean} isInitiator
         * @memberof peer_rpc.SyncRouteInfoRequest
         * @instance
         */
        SyncRouteInfoRequest.prototype.isInitiator = false;

        /**
         * SyncRouteInfoRequest peerInfos.
         * @member {peer_rpc.RoutePeerInfos.$Properties|null|undefined} peerInfos
         * @memberof peer_rpc.SyncRouteInfoRequest
         * @instance
         */
        SyncRouteInfoRequest.prototype.peerInfos = null;

        /**
         * SyncRouteInfoRequest connBitmap.
         * @member {peer_rpc.RouteConnBitmap.$Properties|null|undefined} connBitmap
         * @memberof peer_rpc.SyncRouteInfoRequest
         * @instance
         */
        SyncRouteInfoRequest.prototype.connBitmap = null;

        /**
         * SyncRouteInfoRequest connPeerList.
         * @member {peer_rpc.RouteConnPeerList.$Properties|null|undefined} connPeerList
         * @memberof peer_rpc.SyncRouteInfoRequest
         * @instance
         */
        SyncRouteInfoRequest.prototype.connPeerList = null;

        /**
         * SyncRouteInfoRequest foreignNetworkInfos.
         * @member {peer_rpc.RouteForeignNetworkInfos.$Properties|null|undefined} foreignNetworkInfos
         * @memberof peer_rpc.SyncRouteInfoRequest
         * @instance
         */
        SyncRouteInfoRequest.prototype.foreignNetworkInfos = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * SyncRouteInfoRequest connInfo.
         * @member {"connBitmap"|"connPeerList"|undefined} connInfo
         * @memberof peer_rpc.SyncRouteInfoRequest
         * @instance
         */
        $Object.defineProperty(SyncRouteInfoRequest.prototype, "connInfo", {
            get: $util.oneOfGetter($oneOfFields = ["connBitmap", "connPeerList"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified SyncRouteInfoRequest message. Does not implicitly {@link peer_rpc.SyncRouteInfoRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.SyncRouteInfoRequest
         * @static
         * @param {peer_rpc.SyncRouteInfoRequest.$Properties} message SyncRouteInfoRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncRouteInfoRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.myPeerId != null && $Object.hasOwnProperty.call(message, "myPeerId") && message.myPeerId !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.myPeerId);
            if (message.mySessionId != null && $Object.hasOwnProperty.call(message, "mySessionId") && (typeof message.mySessionId === "object" ? message.mySessionId.low || message.mySessionId.high : message.mySessionId !== 0))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.mySessionId);
            if (message.isInitiator != null && $Object.hasOwnProperty.call(message, "isInitiator") && message.isInitiator !== false)
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isInitiator);
            if (message.peerInfos != null && $Object.hasOwnProperty.call(message, "peerInfos"))
                $root.peer_rpc.RoutePeerInfos.encode(message.peerInfos, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.connBitmap != null && $Object.hasOwnProperty.call(message, "connBitmap"))
                $root.peer_rpc.RouteConnBitmap.encode(message.connBitmap, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
            if (message.foreignNetworkInfos != null && $Object.hasOwnProperty.call(message, "foreignNetworkInfos"))
                $root.peer_rpc.RouteForeignNetworkInfos.encode(message.foreignNetworkInfos, writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
            if (message.connPeerList != null && $Object.hasOwnProperty.call(message, "connPeerList"))
                $root.peer_rpc.RouteConnPeerList.encode(message.connPeerList, writer.uint32(/* id 7, wireType 2 =*/58).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a SyncRouteInfoRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.SyncRouteInfoRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.SyncRouteInfoRequest & peer_rpc.SyncRouteInfoRequest.$Shape} SyncRouteInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncRouteInfoRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.SyncRouteInfoRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.myPeerId = value;
                        else
                            delete message.myPeerId;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.mySessionId = value;
                        else
                            delete message.mySessionId;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.isInitiator = value;
                        else
                            delete message.isInitiator;
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.peerInfos = $root.peer_rpc.RoutePeerInfos.decode(reader, reader.uint32(), $undefined, _depth + 1, message.peerInfos);
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        message.connBitmap = $root.peer_rpc.RouteConnBitmap.decode(reader, reader.uint32(), $undefined, _depth + 1, message.connBitmap);
                        message.connInfo = "connBitmap";
                        continue;
                    }
                case 7: {
                        if (wireType !== 2)
                            break;
                        message.connPeerList = $root.peer_rpc.RouteConnPeerList.decode(reader, reader.uint32(), $undefined, _depth + 1, message.connPeerList);
                        message.connInfo = "connPeerList";
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        message.foreignNetworkInfos = $root.peer_rpc.RouteForeignNetworkInfos.decode(reader, reader.uint32(), $undefined, _depth + 1, message.foreignNetworkInfos);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return SyncRouteInfoRequest;
    })();

    /**
     * SyncRouteInfoError enum.
     * @name peer_rpc.SyncRouteInfoError
     * @enum {number}
     * @property {number} DuplicatePeerId=0 DuplicatePeerId value
     * @property {number} Stopped=1 Stopped value
     */
    peer_rpc.SyncRouteInfoError = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "DuplicatePeerId"] = 0;
        values[valuesById[1] = "Stopped"] = 1;
        return values;
    })();

    peer_rpc.SyncRouteInfoResponse = (function() {

        /**
         * Properties of a SyncRouteInfoResponse.
         * @typedef {Object} peer_rpc.SyncRouteInfoResponse.$Properties
         * @property {boolean|null} [isInitiator] SyncRouteInfoResponse isInitiator
         * @property {Long|null} [sessionId] SyncRouteInfoResponse sessionId
         * @property {peer_rpc.SyncRouteInfoError|null} [error] SyncRouteInfoResponse error
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a SyncRouteInfoResponse.
         * @memberof peer_rpc
         * @interface ISyncRouteInfoResponse
         * @augments peer_rpc.SyncRouteInfoResponse.$Properties
         * @deprecated Use peer_rpc.SyncRouteInfoResponse.$Properties instead.
         */

        /**
         * Shape of a SyncRouteInfoResponse.
         * @typedef {peer_rpc.SyncRouteInfoResponse.$Properties} peer_rpc.SyncRouteInfoResponse.$Shape
         */

        /**
         * Constructs a new SyncRouteInfoResponse.
         * @memberof peer_rpc
         * @classdesc Represents a SyncRouteInfoResponse.
         * @constructor
         * @param {peer_rpc.SyncRouteInfoResponse.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const SyncRouteInfoResponse = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * SyncRouteInfoResponse isInitiator.
         * @member {boolean} isInitiator
         * @memberof peer_rpc.SyncRouteInfoResponse
         * @instance
         */
        SyncRouteInfoResponse.prototype.isInitiator = false;

        /**
         * SyncRouteInfoResponse sessionId.
         * @member {Long} sessionId
         * @memberof peer_rpc.SyncRouteInfoResponse
         * @instance
         */
        SyncRouteInfoResponse.prototype.sessionId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * SyncRouteInfoResponse error.
         * @member {peer_rpc.SyncRouteInfoError|null|undefined} error
         * @memberof peer_rpc.SyncRouteInfoResponse
         * @instance
         */
        SyncRouteInfoResponse.prototype.error = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(SyncRouteInfoResponse.prototype, "_error", {
            get: $util.oneOfGetter($oneOfFields = ["error"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified SyncRouteInfoResponse message. Does not implicitly {@link peer_rpc.SyncRouteInfoResponse.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.SyncRouteInfoResponse
         * @static
         * @param {peer_rpc.SyncRouteInfoResponse.$Properties} message SyncRouteInfoResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncRouteInfoResponse.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.isInitiator != null && $Object.hasOwnProperty.call(message, "isInitiator") && message.isInitiator !== false)
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isInitiator);
            if (message.sessionId != null && $Object.hasOwnProperty.call(message, "sessionId") && (typeof message.sessionId === "object" ? message.sessionId.low || message.sessionId.high : message.sessionId !== 0))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.sessionId);
            if (message.error != null && $Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.error);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a SyncRouteInfoResponse message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.SyncRouteInfoResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.SyncRouteInfoResponse & peer_rpc.SyncRouteInfoResponse.$Shape} SyncRouteInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncRouteInfoResponse.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.SyncRouteInfoResponse(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.isInitiator = value;
                        else
                            delete message.isInitiator;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.sessionId = value;
                        else
                            delete message.sessionId;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        message.error = reader.int32();
                        message._error = "error";
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return SyncRouteInfoResponse;
    })();

    peer_rpc.AcquireIpv6PublicAddrLeaseRequest = (function() {

        /**
         * Properties of an AcquireIpv6PublicAddrLeaseRequest.
         * @typedef {Object} peer_rpc.AcquireIpv6PublicAddrLeaseRequest.$Properties
         * @property {number|null} [peerId] AcquireIpv6PublicAddrLeaseRequest peerId
         * @property {common.UUID.$Properties|null} [instId] AcquireIpv6PublicAddrLeaseRequest instId
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an AcquireIpv6PublicAddrLeaseRequest.
         * @memberof peer_rpc
         * @interface IAcquireIpv6PublicAddrLeaseRequest
         * @augments peer_rpc.AcquireIpv6PublicAddrLeaseRequest.$Properties
         * @deprecated Use peer_rpc.AcquireIpv6PublicAddrLeaseRequest.$Properties instead.
         */

        /**
         * Shape of an AcquireIpv6PublicAddrLeaseRequest.
         * @typedef {peer_rpc.AcquireIpv6PublicAddrLeaseRequest.$Properties} peer_rpc.AcquireIpv6PublicAddrLeaseRequest.$Shape
         */

        /**
         * Constructs a new AcquireIpv6PublicAddrLeaseRequest.
         * @memberof peer_rpc
         * @classdesc Represents an AcquireIpv6PublicAddrLeaseRequest.
         * @constructor
         * @param {peer_rpc.AcquireIpv6PublicAddrLeaseRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const AcquireIpv6PublicAddrLeaseRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * AcquireIpv6PublicAddrLeaseRequest peerId.
         * @member {number} peerId
         * @memberof peer_rpc.AcquireIpv6PublicAddrLeaseRequest
         * @instance
         */
        AcquireIpv6PublicAddrLeaseRequest.prototype.peerId = 0;

        /**
         * AcquireIpv6PublicAddrLeaseRequest instId.
         * @member {common.UUID.$Properties|null|undefined} instId
         * @memberof peer_rpc.AcquireIpv6PublicAddrLeaseRequest
         * @instance
         */
        AcquireIpv6PublicAddrLeaseRequest.prototype.instId = null;

        /**
         * Encodes the specified AcquireIpv6PublicAddrLeaseRequest message. Does not implicitly {@link peer_rpc.AcquireIpv6PublicAddrLeaseRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.AcquireIpv6PublicAddrLeaseRequest
         * @static
         * @param {peer_rpc.AcquireIpv6PublicAddrLeaseRequest.$Properties} message AcquireIpv6PublicAddrLeaseRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AcquireIpv6PublicAddrLeaseRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.peerId != null && $Object.hasOwnProperty.call(message, "peerId") && message.peerId !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.peerId);
            if (message.instId != null && $Object.hasOwnProperty.call(message, "instId"))
                $root.common.UUID.encode(message.instId, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an AcquireIpv6PublicAddrLeaseRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.AcquireIpv6PublicAddrLeaseRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.AcquireIpv6PublicAddrLeaseRequest & peer_rpc.AcquireIpv6PublicAddrLeaseRequest.$Shape} AcquireIpv6PublicAddrLeaseRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AcquireIpv6PublicAddrLeaseRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.AcquireIpv6PublicAddrLeaseRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.peerId = value;
                        else
                            delete message.peerId;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.instId = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.instId);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return AcquireIpv6PublicAddrLeaseRequest;
    })();

    peer_rpc.RenewIpv6PublicAddrLeaseRequest = (function() {

        /**
         * Properties of a RenewIpv6PublicAddrLeaseRequest.
         * @typedef {Object} peer_rpc.RenewIpv6PublicAddrLeaseRequest.$Properties
         * @property {number|null} [peerId] RenewIpv6PublicAddrLeaseRequest peerId
         * @property {common.UUID.$Properties|null} [instId] RenewIpv6PublicAddrLeaseRequest instId
         * @property {common.Ipv6Inet.$Properties|null} [leasedAddr] RenewIpv6PublicAddrLeaseRequest leasedAddr
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RenewIpv6PublicAddrLeaseRequest.
         * @memberof peer_rpc
         * @interface IRenewIpv6PublicAddrLeaseRequest
         * @augments peer_rpc.RenewIpv6PublicAddrLeaseRequest.$Properties
         * @deprecated Use peer_rpc.RenewIpv6PublicAddrLeaseRequest.$Properties instead.
         */

        /**
         * Shape of a RenewIpv6PublicAddrLeaseRequest.
         * @typedef {peer_rpc.RenewIpv6PublicAddrLeaseRequest.$Properties} peer_rpc.RenewIpv6PublicAddrLeaseRequest.$Shape
         */

        /**
         * Constructs a new RenewIpv6PublicAddrLeaseRequest.
         * @memberof peer_rpc
         * @classdesc Represents a RenewIpv6PublicAddrLeaseRequest.
         * @constructor
         * @param {peer_rpc.RenewIpv6PublicAddrLeaseRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RenewIpv6PublicAddrLeaseRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RenewIpv6PublicAddrLeaseRequest peerId.
         * @member {number} peerId
         * @memberof peer_rpc.RenewIpv6PublicAddrLeaseRequest
         * @instance
         */
        RenewIpv6PublicAddrLeaseRequest.prototype.peerId = 0;

        /**
         * RenewIpv6PublicAddrLeaseRequest instId.
         * @member {common.UUID.$Properties|null|undefined} instId
         * @memberof peer_rpc.RenewIpv6PublicAddrLeaseRequest
         * @instance
         */
        RenewIpv6PublicAddrLeaseRequest.prototype.instId = null;

        /**
         * RenewIpv6PublicAddrLeaseRequest leasedAddr.
         * @member {common.Ipv6Inet.$Properties|null|undefined} leasedAddr
         * @memberof peer_rpc.RenewIpv6PublicAddrLeaseRequest
         * @instance
         */
        RenewIpv6PublicAddrLeaseRequest.prototype.leasedAddr = null;

        /**
         * Encodes the specified RenewIpv6PublicAddrLeaseRequest message. Does not implicitly {@link peer_rpc.RenewIpv6PublicAddrLeaseRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.RenewIpv6PublicAddrLeaseRequest
         * @static
         * @param {peer_rpc.RenewIpv6PublicAddrLeaseRequest.$Properties} message RenewIpv6PublicAddrLeaseRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RenewIpv6PublicAddrLeaseRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.peerId != null && $Object.hasOwnProperty.call(message, "peerId") && message.peerId !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.peerId);
            if (message.instId != null && $Object.hasOwnProperty.call(message, "instId"))
                $root.common.UUID.encode(message.instId, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.leasedAddr != null && $Object.hasOwnProperty.call(message, "leasedAddr"))
                $root.common.Ipv6Inet.encode(message.leasedAddr, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RenewIpv6PublicAddrLeaseRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.RenewIpv6PublicAddrLeaseRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.RenewIpv6PublicAddrLeaseRequest & peer_rpc.RenewIpv6PublicAddrLeaseRequest.$Shape} RenewIpv6PublicAddrLeaseRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RenewIpv6PublicAddrLeaseRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.RenewIpv6PublicAddrLeaseRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.peerId = value;
                        else
                            delete message.peerId;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.instId = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.instId);
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.leasedAddr = $root.common.Ipv6Inet.decode(reader, reader.uint32(), $undefined, _depth + 1, message.leasedAddr);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return RenewIpv6PublicAddrLeaseRequest;
    })();

    peer_rpc.ReleaseIpv6PublicAddrLeaseRequest = (function() {

        /**
         * Properties of a ReleaseIpv6PublicAddrLeaseRequest.
         * @typedef {Object} peer_rpc.ReleaseIpv6PublicAddrLeaseRequest.$Properties
         * @property {number|null} [peerId] ReleaseIpv6PublicAddrLeaseRequest peerId
         * @property {common.UUID.$Properties|null} [instId] ReleaseIpv6PublicAddrLeaseRequest instId
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a ReleaseIpv6PublicAddrLeaseRequest.
         * @memberof peer_rpc
         * @interface IReleaseIpv6PublicAddrLeaseRequest
         * @augments peer_rpc.ReleaseIpv6PublicAddrLeaseRequest.$Properties
         * @deprecated Use peer_rpc.ReleaseIpv6PublicAddrLeaseRequest.$Properties instead.
         */

        /**
         * Shape of a ReleaseIpv6PublicAddrLeaseRequest.
         * @typedef {peer_rpc.ReleaseIpv6PublicAddrLeaseRequest.$Properties} peer_rpc.ReleaseIpv6PublicAddrLeaseRequest.$Shape
         */

        /**
         * Constructs a new ReleaseIpv6PublicAddrLeaseRequest.
         * @memberof peer_rpc
         * @classdesc Represents a ReleaseIpv6PublicAddrLeaseRequest.
         * @constructor
         * @param {peer_rpc.ReleaseIpv6PublicAddrLeaseRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const ReleaseIpv6PublicAddrLeaseRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * ReleaseIpv6PublicAddrLeaseRequest peerId.
         * @member {number} peerId
         * @memberof peer_rpc.ReleaseIpv6PublicAddrLeaseRequest
         * @instance
         */
        ReleaseIpv6PublicAddrLeaseRequest.prototype.peerId = 0;

        /**
         * ReleaseIpv6PublicAddrLeaseRequest instId.
         * @member {common.UUID.$Properties|null|undefined} instId
         * @memberof peer_rpc.ReleaseIpv6PublicAddrLeaseRequest
         * @instance
         */
        ReleaseIpv6PublicAddrLeaseRequest.prototype.instId = null;

        /**
         * Encodes the specified ReleaseIpv6PublicAddrLeaseRequest message. Does not implicitly {@link peer_rpc.ReleaseIpv6PublicAddrLeaseRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.ReleaseIpv6PublicAddrLeaseRequest
         * @static
         * @param {peer_rpc.ReleaseIpv6PublicAddrLeaseRequest.$Properties} message ReleaseIpv6PublicAddrLeaseRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReleaseIpv6PublicAddrLeaseRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.peerId != null && $Object.hasOwnProperty.call(message, "peerId") && message.peerId !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.peerId);
            if (message.instId != null && $Object.hasOwnProperty.call(message, "instId"))
                $root.common.UUID.encode(message.instId, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a ReleaseIpv6PublicAddrLeaseRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.ReleaseIpv6PublicAddrLeaseRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.ReleaseIpv6PublicAddrLeaseRequest & peer_rpc.ReleaseIpv6PublicAddrLeaseRequest.$Shape} ReleaseIpv6PublicAddrLeaseRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReleaseIpv6PublicAddrLeaseRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.ReleaseIpv6PublicAddrLeaseRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.peerId = value;
                        else
                            delete message.peerId;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.instId = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.instId);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return ReleaseIpv6PublicAddrLeaseRequest;
    })();

    peer_rpc.GetIpv6PublicAddrLeaseRequest = (function() {

        /**
         * Properties of a GetIpv6PublicAddrLeaseRequest.
         * @typedef {Object} peer_rpc.GetIpv6PublicAddrLeaseRequest.$Properties
         * @property {number|null} [peerId] GetIpv6PublicAddrLeaseRequest peerId
         * @property {common.UUID.$Properties|null} [instId] GetIpv6PublicAddrLeaseRequest instId
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a GetIpv6PublicAddrLeaseRequest.
         * @memberof peer_rpc
         * @interface IGetIpv6PublicAddrLeaseRequest
         * @augments peer_rpc.GetIpv6PublicAddrLeaseRequest.$Properties
         * @deprecated Use peer_rpc.GetIpv6PublicAddrLeaseRequest.$Properties instead.
         */

        /**
         * Shape of a GetIpv6PublicAddrLeaseRequest.
         * @typedef {peer_rpc.GetIpv6PublicAddrLeaseRequest.$Properties} peer_rpc.GetIpv6PublicAddrLeaseRequest.$Shape
         */

        /**
         * Constructs a new GetIpv6PublicAddrLeaseRequest.
         * @memberof peer_rpc
         * @classdesc Represents a GetIpv6PublicAddrLeaseRequest.
         * @constructor
         * @param {peer_rpc.GetIpv6PublicAddrLeaseRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const GetIpv6PublicAddrLeaseRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * GetIpv6PublicAddrLeaseRequest peerId.
         * @member {number} peerId
         * @memberof peer_rpc.GetIpv6PublicAddrLeaseRequest
         * @instance
         */
        GetIpv6PublicAddrLeaseRequest.prototype.peerId = 0;

        /**
         * GetIpv6PublicAddrLeaseRequest instId.
         * @member {common.UUID.$Properties|null|undefined} instId
         * @memberof peer_rpc.GetIpv6PublicAddrLeaseRequest
         * @instance
         */
        GetIpv6PublicAddrLeaseRequest.prototype.instId = null;

        /**
         * Encodes the specified GetIpv6PublicAddrLeaseRequest message. Does not implicitly {@link peer_rpc.GetIpv6PublicAddrLeaseRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.GetIpv6PublicAddrLeaseRequest
         * @static
         * @param {peer_rpc.GetIpv6PublicAddrLeaseRequest.$Properties} message GetIpv6PublicAddrLeaseRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetIpv6PublicAddrLeaseRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.peerId != null && $Object.hasOwnProperty.call(message, "peerId") && message.peerId !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.peerId);
            if (message.instId != null && $Object.hasOwnProperty.call(message, "instId"))
                $root.common.UUID.encode(message.instId, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a GetIpv6PublicAddrLeaseRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.GetIpv6PublicAddrLeaseRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.GetIpv6PublicAddrLeaseRequest & peer_rpc.GetIpv6PublicAddrLeaseRequest.$Shape} GetIpv6PublicAddrLeaseRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetIpv6PublicAddrLeaseRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.GetIpv6PublicAddrLeaseRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.peerId = value;
                        else
                            delete message.peerId;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.instId = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.instId);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return GetIpv6PublicAddrLeaseRequest;
    })();

    peer_rpc.Ipv6PublicAddrLeaseReply = (function() {

        /**
         * Properties of an Ipv6PublicAddrLeaseReply.
         * @typedef {Object} peer_rpc.Ipv6PublicAddrLeaseReply.$Properties
         * @property {number|null} [providerPeerId] Ipv6PublicAddrLeaseReply providerPeerId
         * @property {common.UUID.$Properties|null} [providerInstId] Ipv6PublicAddrLeaseReply providerInstId
         * @property {common.Ipv6Inet.$Properties|null} [providerPrefix] Ipv6PublicAddrLeaseReply providerPrefix
         * @property {common.Ipv6Inet.$Properties|null} [leasedAddr] Ipv6PublicAddrLeaseReply leasedAddr
         * @property {google.protobuf.Timestamp.$Properties|null} [validUntil] Ipv6PublicAddrLeaseReply validUntil
         * @property {boolean|null} [reused] Ipv6PublicAddrLeaseReply reused
         * @property {string|null} [errorMsg] Ipv6PublicAddrLeaseReply errorMsg
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an Ipv6PublicAddrLeaseReply.
         * @memberof peer_rpc
         * @interface IIpv6PublicAddrLeaseReply
         * @augments peer_rpc.Ipv6PublicAddrLeaseReply.$Properties
         * @deprecated Use peer_rpc.Ipv6PublicAddrLeaseReply.$Properties instead.
         */

        /**
         * Shape of an Ipv6PublicAddrLeaseReply.
         * @typedef {peer_rpc.Ipv6PublicAddrLeaseReply.$Properties} peer_rpc.Ipv6PublicAddrLeaseReply.$Shape
         */

        /**
         * Constructs a new Ipv6PublicAddrLeaseReply.
         * @memberof peer_rpc
         * @classdesc Represents an Ipv6PublicAddrLeaseReply.
         * @constructor
         * @param {peer_rpc.Ipv6PublicAddrLeaseReply.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Ipv6PublicAddrLeaseReply = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Ipv6PublicAddrLeaseReply providerPeerId.
         * @member {number} providerPeerId
         * @memberof peer_rpc.Ipv6PublicAddrLeaseReply
         * @instance
         */
        Ipv6PublicAddrLeaseReply.prototype.providerPeerId = 0;

        /**
         * Ipv6PublicAddrLeaseReply providerInstId.
         * @member {common.UUID.$Properties|null|undefined} providerInstId
         * @memberof peer_rpc.Ipv6PublicAddrLeaseReply
         * @instance
         */
        Ipv6PublicAddrLeaseReply.prototype.providerInstId = null;

        /**
         * Ipv6PublicAddrLeaseReply providerPrefix.
         * @member {common.Ipv6Inet.$Properties|null|undefined} providerPrefix
         * @memberof peer_rpc.Ipv6PublicAddrLeaseReply
         * @instance
         */
        Ipv6PublicAddrLeaseReply.prototype.providerPrefix = null;

        /**
         * Ipv6PublicAddrLeaseReply leasedAddr.
         * @member {common.Ipv6Inet.$Properties|null|undefined} leasedAddr
         * @memberof peer_rpc.Ipv6PublicAddrLeaseReply
         * @instance
         */
        Ipv6PublicAddrLeaseReply.prototype.leasedAddr = null;

        /**
         * Ipv6PublicAddrLeaseReply validUntil.
         * @member {google.protobuf.Timestamp.$Properties|null|undefined} validUntil
         * @memberof peer_rpc.Ipv6PublicAddrLeaseReply
         * @instance
         */
        Ipv6PublicAddrLeaseReply.prototype.validUntil = null;

        /**
         * Ipv6PublicAddrLeaseReply reused.
         * @member {boolean} reused
         * @memberof peer_rpc.Ipv6PublicAddrLeaseReply
         * @instance
         */
        Ipv6PublicAddrLeaseReply.prototype.reused = false;

        /**
         * Ipv6PublicAddrLeaseReply errorMsg.
         * @member {string|null|undefined} errorMsg
         * @memberof peer_rpc.Ipv6PublicAddrLeaseReply
         * @instance
         */
        Ipv6PublicAddrLeaseReply.prototype.errorMsg = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(Ipv6PublicAddrLeaseReply.prototype, "_errorMsg", {
            get: $util.oneOfGetter($oneOfFields = ["errorMsg"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified Ipv6PublicAddrLeaseReply message. Does not implicitly {@link peer_rpc.Ipv6PublicAddrLeaseReply.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.Ipv6PublicAddrLeaseReply
         * @static
         * @param {peer_rpc.Ipv6PublicAddrLeaseReply.$Properties} message Ipv6PublicAddrLeaseReply message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Ipv6PublicAddrLeaseReply.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.providerPeerId != null && $Object.hasOwnProperty.call(message, "providerPeerId") && message.providerPeerId !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.providerPeerId);
            if (message.providerInstId != null && $Object.hasOwnProperty.call(message, "providerInstId"))
                $root.common.UUID.encode(message.providerInstId, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.providerPrefix != null && $Object.hasOwnProperty.call(message, "providerPrefix"))
                $root.common.Ipv6Inet.encode(message.providerPrefix, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.leasedAddr != null && $Object.hasOwnProperty.call(message, "leasedAddr"))
                $root.common.Ipv6Inet.encode(message.leasedAddr, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.validUntil != null && $Object.hasOwnProperty.call(message, "validUntil"))
                $root.google.protobuf.Timestamp.encode(message.validUntil, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
            if (message.reused != null && $Object.hasOwnProperty.call(message, "reused") && message.reused !== false)
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.reused);
            if (message.errorMsg != null && $Object.hasOwnProperty.call(message, "errorMsg"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.errorMsg);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an Ipv6PublicAddrLeaseReply message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.Ipv6PublicAddrLeaseReply
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.Ipv6PublicAddrLeaseReply & peer_rpc.Ipv6PublicAddrLeaseReply.$Shape} Ipv6PublicAddrLeaseReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Ipv6PublicAddrLeaseReply.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.Ipv6PublicAddrLeaseReply(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.providerPeerId = value;
                        else
                            delete message.providerPeerId;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.providerInstId = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.providerInstId);
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.providerPrefix = $root.common.Ipv6Inet.decode(reader, reader.uint32(), $undefined, _depth + 1, message.providerPrefix);
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.leasedAddr = $root.common.Ipv6Inet.decode(reader, reader.uint32(), $undefined, _depth + 1, message.leasedAddr);
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        message.validUntil = $root.google.protobuf.Timestamp.decode(reader, reader.uint32(), $undefined, _depth + 1, message.validUntil);
                        continue;
                    }
                case 6: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.reused = value;
                        else
                            delete message.reused;
                        continue;
                    }
                case 7: {
                        if (wireType !== 2)
                            break;
                        message.errorMsg = reader.stringVerify();
                        message._errorMsg = "errorMsg";
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return Ipv6PublicAddrLeaseReply;
    })();

    peer_rpc.GetIpListRequest = (function() {

        /**
         * Properties of a GetIpListRequest.
         * @typedef {Object} peer_rpc.GetIpListRequest.$Properties
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a GetIpListRequest.
         * @memberof peer_rpc
         * @interface IGetIpListRequest
         * @augments peer_rpc.GetIpListRequest.$Properties
         * @deprecated Use peer_rpc.GetIpListRequest.$Properties instead.
         */

        /**
         * Shape of a GetIpListRequest.
         * @typedef {peer_rpc.GetIpListRequest.$Properties} peer_rpc.GetIpListRequest.$Shape
         */

        /**
         * Constructs a new GetIpListRequest.
         * @memberof peer_rpc
         * @classdesc Represents a GetIpListRequest.
         * @constructor
         * @param {peer_rpc.GetIpListRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const GetIpListRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Encodes the specified GetIpListRequest message. Does not implicitly {@link peer_rpc.GetIpListRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.GetIpListRequest
         * @static
         * @param {peer_rpc.GetIpListRequest.$Properties} message GetIpListRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetIpListRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a GetIpListRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.GetIpListRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.GetIpListRequest & peer_rpc.GetIpListRequest.$Shape} GetIpListRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetIpListRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.GetIpListRequest();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                reader.skipType(tag & 7, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return GetIpListRequest;
    })();

    peer_rpc.GetIpListResponse = (function() {

        /**
         * Properties of a GetIpListResponse.
         * @typedef {Object} peer_rpc.GetIpListResponse.$Properties
         * @property {common.Ipv4Addr.$Properties|null} [publicIpv4] GetIpListResponse publicIpv4
         * @property {Array.<common.Ipv4Addr.$Properties>|null} [interfaceIpv4s] GetIpListResponse interfaceIpv4s
         * @property {common.Ipv6Addr.$Properties|null} [publicIpv6] GetIpListResponse publicIpv6
         * @property {Array.<common.Ipv6Addr.$Properties>|null} [interfaceIpv6s] GetIpListResponse interfaceIpv6s
         * @property {Array.<common.Url.$Properties>|null} [listeners] GetIpListResponse listeners
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a GetIpListResponse.
         * @memberof peer_rpc
         * @interface IGetIpListResponse
         * @augments peer_rpc.GetIpListResponse.$Properties
         * @deprecated Use peer_rpc.GetIpListResponse.$Properties instead.
         */

        /**
         * Shape of a GetIpListResponse.
         * @typedef {peer_rpc.GetIpListResponse.$Properties} peer_rpc.GetIpListResponse.$Shape
         */

        /**
         * Constructs a new GetIpListResponse.
         * @memberof peer_rpc
         * @classdesc Represents a GetIpListResponse.
         * @constructor
         * @param {peer_rpc.GetIpListResponse.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const GetIpListResponse = function (properties) {
            this.interfaceIpv4s = [];
            this.interfaceIpv6s = [];
            this.listeners = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * GetIpListResponse publicIpv4.
         * @member {common.Ipv4Addr.$Properties|null|undefined} publicIpv4
         * @memberof peer_rpc.GetIpListResponse
         * @instance
         */
        GetIpListResponse.prototype.publicIpv4 = null;

        /**
         * GetIpListResponse interfaceIpv4s.
         * @member {Array.<common.Ipv4Addr.$Properties>} interfaceIpv4s
         * @memberof peer_rpc.GetIpListResponse
         * @instance
         */
        GetIpListResponse.prototype.interfaceIpv4s = $util.emptyArray;

        /**
         * GetIpListResponse publicIpv6.
         * @member {common.Ipv6Addr.$Properties|null|undefined} publicIpv6
         * @memberof peer_rpc.GetIpListResponse
         * @instance
         */
        GetIpListResponse.prototype.publicIpv6 = null;

        /**
         * GetIpListResponse interfaceIpv6s.
         * @member {Array.<common.Ipv6Addr.$Properties>} interfaceIpv6s
         * @memberof peer_rpc.GetIpListResponse
         * @instance
         */
        GetIpListResponse.prototype.interfaceIpv6s = $util.emptyArray;

        /**
         * GetIpListResponse listeners.
         * @member {Array.<common.Url.$Properties>} listeners
         * @memberof peer_rpc.GetIpListResponse
         * @instance
         */
        GetIpListResponse.prototype.listeners = $util.emptyArray;

        /**
         * Encodes the specified GetIpListResponse message. Does not implicitly {@link peer_rpc.GetIpListResponse.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.GetIpListResponse
         * @static
         * @param {peer_rpc.GetIpListResponse.$Properties} message GetIpListResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetIpListResponse.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.publicIpv4 != null && $Object.hasOwnProperty.call(message, "publicIpv4"))
                $root.common.Ipv4Addr.encode(message.publicIpv4, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.interfaceIpv4s != null && message.interfaceIpv4s.length)
                for (let i = 0; i < message.interfaceIpv4s.length; ++i)
                    $root.common.Ipv4Addr.encode(message.interfaceIpv4s[i], writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.publicIpv6 != null && $Object.hasOwnProperty.call(message, "publicIpv6"))
                $root.common.Ipv6Addr.encode(message.publicIpv6, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.interfaceIpv6s != null && message.interfaceIpv6s.length)
                for (let i = 0; i < message.interfaceIpv6s.length; ++i)
                    $root.common.Ipv6Addr.encode(message.interfaceIpv6s[i], writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.listeners != null && message.listeners.length)
                for (let i = 0; i < message.listeners.length; ++i)
                    $root.common.Url.encode(message.listeners[i], writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a GetIpListResponse message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.GetIpListResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.GetIpListResponse & peer_rpc.GetIpListResponse.$Shape} GetIpListResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetIpListResponse.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.GetIpListResponse(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.publicIpv4 = $root.common.Ipv4Addr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.publicIpv4);
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if (!(message.interfaceIpv4s && message.interfaceIpv4s.length))
                            message.interfaceIpv4s = [];
                        message.interfaceIpv4s.push($root.common.Ipv4Addr.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.publicIpv6 = $root.common.Ipv6Addr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.publicIpv6);
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        if (!(message.interfaceIpv6s && message.interfaceIpv6s.length))
                            message.interfaceIpv6s = [];
                        message.interfaceIpv6s.push($root.common.Ipv6Addr.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        if (!(message.listeners && message.listeners.length))
                            message.listeners = [];
                        message.listeners.push($root.common.Url.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return GetIpListResponse;
    })();

    peer_rpc.SendUdpHolePunchPacketRequest = (function() {

        /**
         * Properties of a SendUdpHolePunchPacketRequest.
         * @typedef {Object} peer_rpc.SendUdpHolePunchPacketRequest.$Properties
         * @property {common.SocketAddr.$Properties|null} [connectorAddr] SendUdpHolePunchPacketRequest connectorAddr
         * @property {number|null} [listenerPort] SendUdpHolePunchPacketRequest listenerPort
         * @property {common.Ipv6Addr.$Properties|null} [preferredSrcIpv6] SendUdpHolePunchPacketRequest preferredSrcIpv6
         * @property {Array.<common.SocketAddr.$Properties>|null} [connectorAddrs] SendUdpHolePunchPacketRequest connectorAddrs
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a SendUdpHolePunchPacketRequest.
         * @memberof peer_rpc
         * @interface ISendUdpHolePunchPacketRequest
         * @augments peer_rpc.SendUdpHolePunchPacketRequest.$Properties
         * @deprecated Use peer_rpc.SendUdpHolePunchPacketRequest.$Properties instead.
         */

        /**
         * Shape of a SendUdpHolePunchPacketRequest.
         * @typedef {{
         *   connectorAddr?: common.SocketAddr.$Shape|null;
         *   listenerPort?: number|null;
         *   preferredSrcIpv6?: common.Ipv6Addr.$Shape|null;
         *   connectorAddrs?: Array.<common.SocketAddr.$Shape>|null;
         *   $unknowns?: Array.<Uint8Array>;
         * }} peer_rpc.SendUdpHolePunchPacketRequest.$Shape
         */

        /**
         * Constructs a new SendUdpHolePunchPacketRequest.
         * @memberof peer_rpc
         * @classdesc Represents a SendUdpHolePunchPacketRequest.
         * @constructor
         * @param {peer_rpc.SendUdpHolePunchPacketRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const SendUdpHolePunchPacketRequest = function (properties) {
            this.connectorAddrs = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * SendUdpHolePunchPacketRequest connectorAddr.
         * @member {common.SocketAddr.$Properties|null|undefined} connectorAddr
         * @memberof peer_rpc.SendUdpHolePunchPacketRequest
         * @instance
         */
        SendUdpHolePunchPacketRequest.prototype.connectorAddr = null;

        /**
         * SendUdpHolePunchPacketRequest listenerPort.
         * @member {number} listenerPort
         * @memberof peer_rpc.SendUdpHolePunchPacketRequest
         * @instance
         */
        SendUdpHolePunchPacketRequest.prototype.listenerPort = 0;

        /**
         * SendUdpHolePunchPacketRequest preferredSrcIpv6.
         * @member {common.Ipv6Addr.$Properties|null|undefined} preferredSrcIpv6
         * @memberof peer_rpc.SendUdpHolePunchPacketRequest
         * @instance
         */
        SendUdpHolePunchPacketRequest.prototype.preferredSrcIpv6 = null;

        /**
         * SendUdpHolePunchPacketRequest connectorAddrs.
         * @member {Array.<common.SocketAddr.$Properties>} connectorAddrs
         * @memberof peer_rpc.SendUdpHolePunchPacketRequest
         * @instance
         */
        SendUdpHolePunchPacketRequest.prototype.connectorAddrs = $util.emptyArray;

        /**
         * Encodes the specified SendUdpHolePunchPacketRequest message. Does not implicitly {@link peer_rpc.SendUdpHolePunchPacketRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.SendUdpHolePunchPacketRequest
         * @static
         * @param {peer_rpc.SendUdpHolePunchPacketRequest.$Properties} message SendUdpHolePunchPacketRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendUdpHolePunchPacketRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.connectorAddr != null && $Object.hasOwnProperty.call(message, "connectorAddr"))
                $root.common.SocketAddr.encode(message.connectorAddr, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.listenerPort != null && $Object.hasOwnProperty.call(message, "listenerPort") && message.listenerPort !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.listenerPort);
            if (message.preferredSrcIpv6 != null && $Object.hasOwnProperty.call(message, "preferredSrcIpv6"))
                $root.common.Ipv6Addr.encode(message.preferredSrcIpv6, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.connectorAddrs != null && message.connectorAddrs.length)
                for (let i = 0; i < message.connectorAddrs.length; ++i)
                    $root.common.SocketAddr.encode(message.connectorAddrs[i], writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a SendUdpHolePunchPacketRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.SendUdpHolePunchPacketRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.SendUdpHolePunchPacketRequest & peer_rpc.SendUdpHolePunchPacketRequest.$Shape} SendUdpHolePunchPacketRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendUdpHolePunchPacketRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.SendUdpHolePunchPacketRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.connectorAddr = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.connectorAddr);
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.listenerPort = value;
                        else
                            delete message.listenerPort;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.preferredSrcIpv6 = $root.common.Ipv6Addr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.preferredSrcIpv6);
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        if (!(message.connectorAddrs && message.connectorAddrs.length))
                            message.connectorAddrs = [];
                        message.connectorAddrs.push($root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return SendUdpHolePunchPacketRequest;
    })();

    peer_rpc.SelectPunchListenerRequest = (function() {

        /**
         * Properties of a SelectPunchListenerRequest.
         * @typedef {Object} peer_rpc.SelectPunchListenerRequest.$Properties
         * @property {boolean|null} [forceNew] SelectPunchListenerRequest forceNew
         * @property {boolean|null} [preferPortMapping] SelectPunchListenerRequest preferPortMapping
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a SelectPunchListenerRequest.
         * @memberof peer_rpc
         * @interface ISelectPunchListenerRequest
         * @augments peer_rpc.SelectPunchListenerRequest.$Properties
         * @deprecated Use peer_rpc.SelectPunchListenerRequest.$Properties instead.
         */

        /**
         * Shape of a SelectPunchListenerRequest.
         * @typedef {peer_rpc.SelectPunchListenerRequest.$Properties} peer_rpc.SelectPunchListenerRequest.$Shape
         */

        /**
         * Constructs a new SelectPunchListenerRequest.
         * @memberof peer_rpc
         * @classdesc Represents a SelectPunchListenerRequest.
         * @constructor
         * @param {peer_rpc.SelectPunchListenerRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const SelectPunchListenerRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * SelectPunchListenerRequest forceNew.
         * @member {boolean} forceNew
         * @memberof peer_rpc.SelectPunchListenerRequest
         * @instance
         */
        SelectPunchListenerRequest.prototype.forceNew = false;

        /**
         * SelectPunchListenerRequest preferPortMapping.
         * @member {boolean} preferPortMapping
         * @memberof peer_rpc.SelectPunchListenerRequest
         * @instance
         */
        SelectPunchListenerRequest.prototype.preferPortMapping = false;

        /**
         * Encodes the specified SelectPunchListenerRequest message. Does not implicitly {@link peer_rpc.SelectPunchListenerRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.SelectPunchListenerRequest
         * @static
         * @param {peer_rpc.SelectPunchListenerRequest.$Properties} message SelectPunchListenerRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SelectPunchListenerRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.forceNew != null && $Object.hasOwnProperty.call(message, "forceNew") && message.forceNew !== false)
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.forceNew);
            if (message.preferPortMapping != null && $Object.hasOwnProperty.call(message, "preferPortMapping") && message.preferPortMapping !== false)
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.preferPortMapping);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a SelectPunchListenerRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.SelectPunchListenerRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.SelectPunchListenerRequest & peer_rpc.SelectPunchListenerRequest.$Shape} SelectPunchListenerRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SelectPunchListenerRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.SelectPunchListenerRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.forceNew = value;
                        else
                            delete message.forceNew;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.preferPortMapping = value;
                        else
                            delete message.preferPortMapping;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return SelectPunchListenerRequest;
    })();

    peer_rpc.SelectPunchListenerResponse = (function() {

        /**
         * Properties of a SelectPunchListenerResponse.
         * @typedef {Object} peer_rpc.SelectPunchListenerResponse.$Properties
         * @property {common.SocketAddr.$Properties|null} [listenerMappedAddr] SelectPunchListenerResponse listenerMappedAddr
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a SelectPunchListenerResponse.
         * @memberof peer_rpc
         * @interface ISelectPunchListenerResponse
         * @augments peer_rpc.SelectPunchListenerResponse.$Properties
         * @deprecated Use peer_rpc.SelectPunchListenerResponse.$Properties instead.
         */

        /**
         * Shape of a SelectPunchListenerResponse.
         * @typedef {{
         *   listenerMappedAddr?: common.SocketAddr.$Shape|null;
         *   $unknowns?: Array.<Uint8Array>;
         * }} peer_rpc.SelectPunchListenerResponse.$Shape
         */

        /**
         * Constructs a new SelectPunchListenerResponse.
         * @memberof peer_rpc
         * @classdesc Represents a SelectPunchListenerResponse.
         * @constructor
         * @param {peer_rpc.SelectPunchListenerResponse.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const SelectPunchListenerResponse = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * SelectPunchListenerResponse listenerMappedAddr.
         * @member {common.SocketAddr.$Properties|null|undefined} listenerMappedAddr
         * @memberof peer_rpc.SelectPunchListenerResponse
         * @instance
         */
        SelectPunchListenerResponse.prototype.listenerMappedAddr = null;

        /**
         * Encodes the specified SelectPunchListenerResponse message. Does not implicitly {@link peer_rpc.SelectPunchListenerResponse.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.SelectPunchListenerResponse
         * @static
         * @param {peer_rpc.SelectPunchListenerResponse.$Properties} message SelectPunchListenerResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SelectPunchListenerResponse.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.listenerMappedAddr != null && $Object.hasOwnProperty.call(message, "listenerMappedAddr"))
                $root.common.SocketAddr.encode(message.listenerMappedAddr, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a SelectPunchListenerResponse message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.SelectPunchListenerResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.SelectPunchListenerResponse & peer_rpc.SelectPunchListenerResponse.$Shape} SelectPunchListenerResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SelectPunchListenerResponse.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.SelectPunchListenerResponse(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.listenerMappedAddr = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.listenerMappedAddr);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return SelectPunchListenerResponse;
    })();

    peer_rpc.SendPunchPacketConeRequest = (function() {

        /**
         * Properties of a SendPunchPacketConeRequest.
         * @typedef {Object} peer_rpc.SendPunchPacketConeRequest.$Properties
         * @property {common.SocketAddr.$Properties|null} [listenerMappedAddr] SendPunchPacketConeRequest listenerMappedAddr
         * @property {common.SocketAddr.$Properties|null} [destAddr] SendPunchPacketConeRequest destAddr
         * @property {number|null} [transactionId] SendPunchPacketConeRequest transactionId
         * @property {number|null} [packetCountPerBatch] SendPunchPacketConeRequest packetCountPerBatch
         * @property {number|null} [packetBatchCount] SendPunchPacketConeRequest packetBatchCount
         * @property {number|null} [packetIntervalMs] SendPunchPacketConeRequest packetIntervalMs
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a SendPunchPacketConeRequest.
         * @memberof peer_rpc
         * @interface ISendPunchPacketConeRequest
         * @augments peer_rpc.SendPunchPacketConeRequest.$Properties
         * @deprecated Use peer_rpc.SendPunchPacketConeRequest.$Properties instead.
         */

        /**
         * Shape of a SendPunchPacketConeRequest.
         * @typedef {{
         *   listenerMappedAddr?: common.SocketAddr.$Shape|null;
         *   destAddr?: common.SocketAddr.$Shape|null;
         *   transactionId?: number|null;
         *   packetCountPerBatch?: number|null;
         *   packetBatchCount?: number|null;
         *   packetIntervalMs?: number|null;
         *   $unknowns?: Array.<Uint8Array>;
         * }} peer_rpc.SendPunchPacketConeRequest.$Shape
         */

        /**
         * Constructs a new SendPunchPacketConeRequest.
         * @memberof peer_rpc
         * @classdesc Represents a SendPunchPacketConeRequest.
         * @constructor
         * @param {peer_rpc.SendPunchPacketConeRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const SendPunchPacketConeRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * SendPunchPacketConeRequest listenerMappedAddr.
         * @member {common.SocketAddr.$Properties|null|undefined} listenerMappedAddr
         * @memberof peer_rpc.SendPunchPacketConeRequest
         * @instance
         */
        SendPunchPacketConeRequest.prototype.listenerMappedAddr = null;

        /**
         * SendPunchPacketConeRequest destAddr.
         * @member {common.SocketAddr.$Properties|null|undefined} destAddr
         * @memberof peer_rpc.SendPunchPacketConeRequest
         * @instance
         */
        SendPunchPacketConeRequest.prototype.destAddr = null;

        /**
         * SendPunchPacketConeRequest transactionId.
         * @member {number} transactionId
         * @memberof peer_rpc.SendPunchPacketConeRequest
         * @instance
         */
        SendPunchPacketConeRequest.prototype.transactionId = 0;

        /**
         * SendPunchPacketConeRequest packetCountPerBatch.
         * @member {number} packetCountPerBatch
         * @memberof peer_rpc.SendPunchPacketConeRequest
         * @instance
         */
        SendPunchPacketConeRequest.prototype.packetCountPerBatch = 0;

        /**
         * SendPunchPacketConeRequest packetBatchCount.
         * @member {number} packetBatchCount
         * @memberof peer_rpc.SendPunchPacketConeRequest
         * @instance
         */
        SendPunchPacketConeRequest.prototype.packetBatchCount = 0;

        /**
         * SendPunchPacketConeRequest packetIntervalMs.
         * @member {number} packetIntervalMs
         * @memberof peer_rpc.SendPunchPacketConeRequest
         * @instance
         */
        SendPunchPacketConeRequest.prototype.packetIntervalMs = 0;

        /**
         * Encodes the specified SendPunchPacketConeRequest message. Does not implicitly {@link peer_rpc.SendPunchPacketConeRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.SendPunchPacketConeRequest
         * @static
         * @param {peer_rpc.SendPunchPacketConeRequest.$Properties} message SendPunchPacketConeRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendPunchPacketConeRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.listenerMappedAddr != null && $Object.hasOwnProperty.call(message, "listenerMappedAddr"))
                $root.common.SocketAddr.encode(message.listenerMappedAddr, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.destAddr != null && $Object.hasOwnProperty.call(message, "destAddr"))
                $root.common.SocketAddr.encode(message.destAddr, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.transactionId != null && $Object.hasOwnProperty.call(message, "transactionId") && message.transactionId !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.transactionId);
            if (message.packetCountPerBatch != null && $Object.hasOwnProperty.call(message, "packetCountPerBatch") && message.packetCountPerBatch !== 0)
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.packetCountPerBatch);
            if (message.packetBatchCount != null && $Object.hasOwnProperty.call(message, "packetBatchCount") && message.packetBatchCount !== 0)
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.packetBatchCount);
            if (message.packetIntervalMs != null && $Object.hasOwnProperty.call(message, "packetIntervalMs") && message.packetIntervalMs !== 0)
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.packetIntervalMs);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a SendPunchPacketConeRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.SendPunchPacketConeRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.SendPunchPacketConeRequest & peer_rpc.SendPunchPacketConeRequest.$Shape} SendPunchPacketConeRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendPunchPacketConeRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.SendPunchPacketConeRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.listenerMappedAddr = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.listenerMappedAddr);
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.destAddr = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.destAddr);
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.transactionId = value;
                        else
                            delete message.transactionId;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.packetCountPerBatch = value;
                        else
                            delete message.packetCountPerBatch;
                        continue;
                    }
                case 5: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.packetBatchCount = value;
                        else
                            delete message.packetBatchCount;
                        continue;
                    }
                case 6: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.packetIntervalMs = value;
                        else
                            delete message.packetIntervalMs;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return SendPunchPacketConeRequest;
    })();

    peer_rpc.SendPunchPacketHardSymRequest = (function() {

        /**
         * Properties of a SendPunchPacketHardSymRequest.
         * @typedef {Object} peer_rpc.SendPunchPacketHardSymRequest.$Properties
         * @property {common.SocketAddr.$Properties|null} [listenerMappedAddr] SendPunchPacketHardSymRequest listenerMappedAddr
         * @property {Array.<common.Ipv4Addr.$Properties>|null} [publicIps] SendPunchPacketHardSymRequest publicIps
         * @property {number|null} [transactionId] SendPunchPacketHardSymRequest transactionId
         * @property {number|null} [portIndex] SendPunchPacketHardSymRequest portIndex
         * @property {number|null} [round] SendPunchPacketHardSymRequest round
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a SendPunchPacketHardSymRequest.
         * @memberof peer_rpc
         * @interface ISendPunchPacketHardSymRequest
         * @augments peer_rpc.SendPunchPacketHardSymRequest.$Properties
         * @deprecated Use peer_rpc.SendPunchPacketHardSymRequest.$Properties instead.
         */

        /**
         * Shape of a SendPunchPacketHardSymRequest.
         * @typedef {{
         *   listenerMappedAddr?: common.SocketAddr.$Shape|null;
         *   publicIps?: Array.<common.Ipv4Addr.$Shape>|null;
         *   transactionId?: number|null;
         *   portIndex?: number|null;
         *   round?: number|null;
         *   $unknowns?: Array.<Uint8Array>;
         * }} peer_rpc.SendPunchPacketHardSymRequest.$Shape
         */

        /**
         * Constructs a new SendPunchPacketHardSymRequest.
         * @memberof peer_rpc
         * @classdesc Represents a SendPunchPacketHardSymRequest.
         * @constructor
         * @param {peer_rpc.SendPunchPacketHardSymRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const SendPunchPacketHardSymRequest = function (properties) {
            this.publicIps = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * SendPunchPacketHardSymRequest listenerMappedAddr.
         * @member {common.SocketAddr.$Properties|null|undefined} listenerMappedAddr
         * @memberof peer_rpc.SendPunchPacketHardSymRequest
         * @instance
         */
        SendPunchPacketHardSymRequest.prototype.listenerMappedAddr = null;

        /**
         * SendPunchPacketHardSymRequest publicIps.
         * @member {Array.<common.Ipv4Addr.$Properties>} publicIps
         * @memberof peer_rpc.SendPunchPacketHardSymRequest
         * @instance
         */
        SendPunchPacketHardSymRequest.prototype.publicIps = $util.emptyArray;

        /**
         * SendPunchPacketHardSymRequest transactionId.
         * @member {number} transactionId
         * @memberof peer_rpc.SendPunchPacketHardSymRequest
         * @instance
         */
        SendPunchPacketHardSymRequest.prototype.transactionId = 0;

        /**
         * SendPunchPacketHardSymRequest portIndex.
         * @member {number} portIndex
         * @memberof peer_rpc.SendPunchPacketHardSymRequest
         * @instance
         */
        SendPunchPacketHardSymRequest.prototype.portIndex = 0;

        /**
         * SendPunchPacketHardSymRequest round.
         * @member {number} round
         * @memberof peer_rpc.SendPunchPacketHardSymRequest
         * @instance
         */
        SendPunchPacketHardSymRequest.prototype.round = 0;

        /**
         * Encodes the specified SendPunchPacketHardSymRequest message. Does not implicitly {@link peer_rpc.SendPunchPacketHardSymRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.SendPunchPacketHardSymRequest
         * @static
         * @param {peer_rpc.SendPunchPacketHardSymRequest.$Properties} message SendPunchPacketHardSymRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendPunchPacketHardSymRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.listenerMappedAddr != null && $Object.hasOwnProperty.call(message, "listenerMappedAddr"))
                $root.common.SocketAddr.encode(message.listenerMappedAddr, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.publicIps != null && message.publicIps.length)
                for (let i = 0; i < message.publicIps.length; ++i)
                    $root.common.Ipv4Addr.encode(message.publicIps[i], writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.transactionId != null && $Object.hasOwnProperty.call(message, "transactionId") && message.transactionId !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.transactionId);
            if (message.portIndex != null && $Object.hasOwnProperty.call(message, "portIndex") && message.portIndex !== 0)
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.portIndex);
            if (message.round != null && $Object.hasOwnProperty.call(message, "round") && message.round !== 0)
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.round);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a SendPunchPacketHardSymRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.SendPunchPacketHardSymRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.SendPunchPacketHardSymRequest & peer_rpc.SendPunchPacketHardSymRequest.$Shape} SendPunchPacketHardSymRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendPunchPacketHardSymRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.SendPunchPacketHardSymRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.listenerMappedAddr = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.listenerMappedAddr);
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if (!(message.publicIps && message.publicIps.length))
                            message.publicIps = [];
                        message.publicIps.push($root.common.Ipv4Addr.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.transactionId = value;
                        else
                            delete message.transactionId;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.portIndex = value;
                        else
                            delete message.portIndex;
                        continue;
                    }
                case 5: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.round = value;
                        else
                            delete message.round;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return SendPunchPacketHardSymRequest;
    })();

    peer_rpc.SendPunchPacketHardSymResponse = (function() {

        /**
         * Properties of a SendPunchPacketHardSymResponse.
         * @typedef {Object} peer_rpc.SendPunchPacketHardSymResponse.$Properties
         * @property {number|null} [nextPortIndex] SendPunchPacketHardSymResponse nextPortIndex
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a SendPunchPacketHardSymResponse.
         * @memberof peer_rpc
         * @interface ISendPunchPacketHardSymResponse
         * @augments peer_rpc.SendPunchPacketHardSymResponse.$Properties
         * @deprecated Use peer_rpc.SendPunchPacketHardSymResponse.$Properties instead.
         */

        /**
         * Shape of a SendPunchPacketHardSymResponse.
         * @typedef {peer_rpc.SendPunchPacketHardSymResponse.$Properties} peer_rpc.SendPunchPacketHardSymResponse.$Shape
         */

        /**
         * Constructs a new SendPunchPacketHardSymResponse.
         * @memberof peer_rpc
         * @classdesc Represents a SendPunchPacketHardSymResponse.
         * @constructor
         * @param {peer_rpc.SendPunchPacketHardSymResponse.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const SendPunchPacketHardSymResponse = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * SendPunchPacketHardSymResponse nextPortIndex.
         * @member {number} nextPortIndex
         * @memberof peer_rpc.SendPunchPacketHardSymResponse
         * @instance
         */
        SendPunchPacketHardSymResponse.prototype.nextPortIndex = 0;

        /**
         * Encodes the specified SendPunchPacketHardSymResponse message. Does not implicitly {@link peer_rpc.SendPunchPacketHardSymResponse.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.SendPunchPacketHardSymResponse
         * @static
         * @param {peer_rpc.SendPunchPacketHardSymResponse.$Properties} message SendPunchPacketHardSymResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendPunchPacketHardSymResponse.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.nextPortIndex != null && $Object.hasOwnProperty.call(message, "nextPortIndex") && message.nextPortIndex !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.nextPortIndex);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a SendPunchPacketHardSymResponse message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.SendPunchPacketHardSymResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.SendPunchPacketHardSymResponse & peer_rpc.SendPunchPacketHardSymResponse.$Shape} SendPunchPacketHardSymResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendPunchPacketHardSymResponse.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.SendPunchPacketHardSymResponse(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.nextPortIndex = value;
                        else
                            delete message.nextPortIndex;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return SendPunchPacketHardSymResponse;
    })();

    peer_rpc.SendPunchPacketEasySymRequest = (function() {

        /**
         * Properties of a SendPunchPacketEasySymRequest.
         * @typedef {Object} peer_rpc.SendPunchPacketEasySymRequest.$Properties
         * @property {common.SocketAddr.$Properties|null} [listenerMappedAddr] SendPunchPacketEasySymRequest listenerMappedAddr
         * @property {Array.<common.Ipv4Addr.$Properties>|null} [publicIps] SendPunchPacketEasySymRequest publicIps
         * @property {number|null} [transactionId] SendPunchPacketEasySymRequest transactionId
         * @property {number|null} [basePortNum] SendPunchPacketEasySymRequest basePortNum
         * @property {number|null} [maxPortNum] SendPunchPacketEasySymRequest maxPortNum
         * @property {boolean|null} [isIncremental] SendPunchPacketEasySymRequest isIncremental
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a SendPunchPacketEasySymRequest.
         * @memberof peer_rpc
         * @interface ISendPunchPacketEasySymRequest
         * @augments peer_rpc.SendPunchPacketEasySymRequest.$Properties
         * @deprecated Use peer_rpc.SendPunchPacketEasySymRequest.$Properties instead.
         */

        /**
         * Shape of a SendPunchPacketEasySymRequest.
         * @typedef {{
         *   listenerMappedAddr?: common.SocketAddr.$Shape|null;
         *   publicIps?: Array.<common.Ipv4Addr.$Shape>|null;
         *   transactionId?: number|null;
         *   basePortNum?: number|null;
         *   maxPortNum?: number|null;
         *   isIncremental?: boolean|null;
         *   $unknowns?: Array.<Uint8Array>;
         * }} peer_rpc.SendPunchPacketEasySymRequest.$Shape
         */

        /**
         * Constructs a new SendPunchPacketEasySymRequest.
         * @memberof peer_rpc
         * @classdesc Represents a SendPunchPacketEasySymRequest.
         * @constructor
         * @param {peer_rpc.SendPunchPacketEasySymRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const SendPunchPacketEasySymRequest = function (properties) {
            this.publicIps = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * SendPunchPacketEasySymRequest listenerMappedAddr.
         * @member {common.SocketAddr.$Properties|null|undefined} listenerMappedAddr
         * @memberof peer_rpc.SendPunchPacketEasySymRequest
         * @instance
         */
        SendPunchPacketEasySymRequest.prototype.listenerMappedAddr = null;

        /**
         * SendPunchPacketEasySymRequest publicIps.
         * @member {Array.<common.Ipv4Addr.$Properties>} publicIps
         * @memberof peer_rpc.SendPunchPacketEasySymRequest
         * @instance
         */
        SendPunchPacketEasySymRequest.prototype.publicIps = $util.emptyArray;

        /**
         * SendPunchPacketEasySymRequest transactionId.
         * @member {number} transactionId
         * @memberof peer_rpc.SendPunchPacketEasySymRequest
         * @instance
         */
        SendPunchPacketEasySymRequest.prototype.transactionId = 0;

        /**
         * SendPunchPacketEasySymRequest basePortNum.
         * @member {number} basePortNum
         * @memberof peer_rpc.SendPunchPacketEasySymRequest
         * @instance
         */
        SendPunchPacketEasySymRequest.prototype.basePortNum = 0;

        /**
         * SendPunchPacketEasySymRequest maxPortNum.
         * @member {number} maxPortNum
         * @memberof peer_rpc.SendPunchPacketEasySymRequest
         * @instance
         */
        SendPunchPacketEasySymRequest.prototype.maxPortNum = 0;

        /**
         * SendPunchPacketEasySymRequest isIncremental.
         * @member {boolean} isIncremental
         * @memberof peer_rpc.SendPunchPacketEasySymRequest
         * @instance
         */
        SendPunchPacketEasySymRequest.prototype.isIncremental = false;

        /**
         * Encodes the specified SendPunchPacketEasySymRequest message. Does not implicitly {@link peer_rpc.SendPunchPacketEasySymRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.SendPunchPacketEasySymRequest
         * @static
         * @param {peer_rpc.SendPunchPacketEasySymRequest.$Properties} message SendPunchPacketEasySymRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendPunchPacketEasySymRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.listenerMappedAddr != null && $Object.hasOwnProperty.call(message, "listenerMappedAddr"))
                $root.common.SocketAddr.encode(message.listenerMappedAddr, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.publicIps != null && message.publicIps.length)
                for (let i = 0; i < message.publicIps.length; ++i)
                    $root.common.Ipv4Addr.encode(message.publicIps[i], writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.transactionId != null && $Object.hasOwnProperty.call(message, "transactionId") && message.transactionId !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.transactionId);
            if (message.basePortNum != null && $Object.hasOwnProperty.call(message, "basePortNum") && message.basePortNum !== 0)
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.basePortNum);
            if (message.maxPortNum != null && $Object.hasOwnProperty.call(message, "maxPortNum") && message.maxPortNum !== 0)
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.maxPortNum);
            if (message.isIncremental != null && $Object.hasOwnProperty.call(message, "isIncremental") && message.isIncremental !== false)
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.isIncremental);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a SendPunchPacketEasySymRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.SendPunchPacketEasySymRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.SendPunchPacketEasySymRequest & peer_rpc.SendPunchPacketEasySymRequest.$Shape} SendPunchPacketEasySymRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendPunchPacketEasySymRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.SendPunchPacketEasySymRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.listenerMappedAddr = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.listenerMappedAddr);
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if (!(message.publicIps && message.publicIps.length))
                            message.publicIps = [];
                        message.publicIps.push($root.common.Ipv4Addr.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.transactionId = value;
                        else
                            delete message.transactionId;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.basePortNum = value;
                        else
                            delete message.basePortNum;
                        continue;
                    }
                case 5: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.maxPortNum = value;
                        else
                            delete message.maxPortNum;
                        continue;
                    }
                case 6: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.isIncremental = value;
                        else
                            delete message.isIncremental;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return SendPunchPacketEasySymRequest;
    })();

    peer_rpc.SendPunchPacketBothEasySymRequest = (function() {

        /**
         * Properties of a SendPunchPacketBothEasySymRequest.
         * @typedef {Object} peer_rpc.SendPunchPacketBothEasySymRequest.$Properties
         * @property {number|null} [udpSocketCount] SendPunchPacketBothEasySymRequest udpSocketCount
         * @property {common.Ipv4Addr.$Properties|null} [publicIp] SendPunchPacketBothEasySymRequest publicIp
         * @property {number|null} [transactionId] SendPunchPacketBothEasySymRequest transactionId
         * @property {number|null} [dstPortNum] SendPunchPacketBothEasySymRequest dstPortNum
         * @property {number|null} [waitTimeMs] SendPunchPacketBothEasySymRequest waitTimeMs
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a SendPunchPacketBothEasySymRequest.
         * @memberof peer_rpc
         * @interface ISendPunchPacketBothEasySymRequest
         * @augments peer_rpc.SendPunchPacketBothEasySymRequest.$Properties
         * @deprecated Use peer_rpc.SendPunchPacketBothEasySymRequest.$Properties instead.
         */

        /**
         * Shape of a SendPunchPacketBothEasySymRequest.
         * @typedef {peer_rpc.SendPunchPacketBothEasySymRequest.$Properties} peer_rpc.SendPunchPacketBothEasySymRequest.$Shape
         */

        /**
         * Constructs a new SendPunchPacketBothEasySymRequest.
         * @memberof peer_rpc
         * @classdesc Represents a SendPunchPacketBothEasySymRequest.
         * @constructor
         * @param {peer_rpc.SendPunchPacketBothEasySymRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const SendPunchPacketBothEasySymRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * SendPunchPacketBothEasySymRequest udpSocketCount.
         * @member {number} udpSocketCount
         * @memberof peer_rpc.SendPunchPacketBothEasySymRequest
         * @instance
         */
        SendPunchPacketBothEasySymRequest.prototype.udpSocketCount = 0;

        /**
         * SendPunchPacketBothEasySymRequest publicIp.
         * @member {common.Ipv4Addr.$Properties|null|undefined} publicIp
         * @memberof peer_rpc.SendPunchPacketBothEasySymRequest
         * @instance
         */
        SendPunchPacketBothEasySymRequest.prototype.publicIp = null;

        /**
         * SendPunchPacketBothEasySymRequest transactionId.
         * @member {number} transactionId
         * @memberof peer_rpc.SendPunchPacketBothEasySymRequest
         * @instance
         */
        SendPunchPacketBothEasySymRequest.prototype.transactionId = 0;

        /**
         * SendPunchPacketBothEasySymRequest dstPortNum.
         * @member {number} dstPortNum
         * @memberof peer_rpc.SendPunchPacketBothEasySymRequest
         * @instance
         */
        SendPunchPacketBothEasySymRequest.prototype.dstPortNum = 0;

        /**
         * SendPunchPacketBothEasySymRequest waitTimeMs.
         * @member {number} waitTimeMs
         * @memberof peer_rpc.SendPunchPacketBothEasySymRequest
         * @instance
         */
        SendPunchPacketBothEasySymRequest.prototype.waitTimeMs = 0;

        /**
         * Encodes the specified SendPunchPacketBothEasySymRequest message. Does not implicitly {@link peer_rpc.SendPunchPacketBothEasySymRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.SendPunchPacketBothEasySymRequest
         * @static
         * @param {peer_rpc.SendPunchPacketBothEasySymRequest.$Properties} message SendPunchPacketBothEasySymRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendPunchPacketBothEasySymRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.udpSocketCount != null && $Object.hasOwnProperty.call(message, "udpSocketCount") && message.udpSocketCount !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.udpSocketCount);
            if (message.publicIp != null && $Object.hasOwnProperty.call(message, "publicIp"))
                $root.common.Ipv4Addr.encode(message.publicIp, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.transactionId != null && $Object.hasOwnProperty.call(message, "transactionId") && message.transactionId !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.transactionId);
            if (message.dstPortNum != null && $Object.hasOwnProperty.call(message, "dstPortNum") && message.dstPortNum !== 0)
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.dstPortNum);
            if (message.waitTimeMs != null && $Object.hasOwnProperty.call(message, "waitTimeMs") && message.waitTimeMs !== 0)
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.waitTimeMs);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a SendPunchPacketBothEasySymRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.SendPunchPacketBothEasySymRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.SendPunchPacketBothEasySymRequest & peer_rpc.SendPunchPacketBothEasySymRequest.$Shape} SendPunchPacketBothEasySymRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendPunchPacketBothEasySymRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.SendPunchPacketBothEasySymRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.udpSocketCount = value;
                        else
                            delete message.udpSocketCount;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.publicIp = $root.common.Ipv4Addr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.publicIp);
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.transactionId = value;
                        else
                            delete message.transactionId;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.dstPortNum = value;
                        else
                            delete message.dstPortNum;
                        continue;
                    }
                case 5: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.waitTimeMs = value;
                        else
                            delete message.waitTimeMs;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return SendPunchPacketBothEasySymRequest;
    })();

    peer_rpc.SendPunchPacketBothEasySymResponse = (function() {

        /**
         * Properties of a SendPunchPacketBothEasySymResponse.
         * @typedef {Object} peer_rpc.SendPunchPacketBothEasySymResponse.$Properties
         * @property {boolean|null} [isBusy] SendPunchPacketBothEasySymResponse isBusy
         * @property {common.SocketAddr.$Properties|null} [baseMappedAddr] SendPunchPacketBothEasySymResponse baseMappedAddr
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a SendPunchPacketBothEasySymResponse.
         * @memberof peer_rpc
         * @interface ISendPunchPacketBothEasySymResponse
         * @augments peer_rpc.SendPunchPacketBothEasySymResponse.$Properties
         * @deprecated Use peer_rpc.SendPunchPacketBothEasySymResponse.$Properties instead.
         */

        /**
         * Shape of a SendPunchPacketBothEasySymResponse.
         * @typedef {{
         *   isBusy?: boolean|null;
         *   baseMappedAddr?: common.SocketAddr.$Shape|null;
         *   $unknowns?: Array.<Uint8Array>;
         * }} peer_rpc.SendPunchPacketBothEasySymResponse.$Shape
         */

        /**
         * Constructs a new SendPunchPacketBothEasySymResponse.
         * @memberof peer_rpc
         * @classdesc Represents a SendPunchPacketBothEasySymResponse.
         * @constructor
         * @param {peer_rpc.SendPunchPacketBothEasySymResponse.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const SendPunchPacketBothEasySymResponse = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * SendPunchPacketBothEasySymResponse isBusy.
         * @member {boolean} isBusy
         * @memberof peer_rpc.SendPunchPacketBothEasySymResponse
         * @instance
         */
        SendPunchPacketBothEasySymResponse.prototype.isBusy = false;

        /**
         * SendPunchPacketBothEasySymResponse baseMappedAddr.
         * @member {common.SocketAddr.$Properties|null|undefined} baseMappedAddr
         * @memberof peer_rpc.SendPunchPacketBothEasySymResponse
         * @instance
         */
        SendPunchPacketBothEasySymResponse.prototype.baseMappedAddr = null;

        /**
         * Encodes the specified SendPunchPacketBothEasySymResponse message. Does not implicitly {@link peer_rpc.SendPunchPacketBothEasySymResponse.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.SendPunchPacketBothEasySymResponse
         * @static
         * @param {peer_rpc.SendPunchPacketBothEasySymResponse.$Properties} message SendPunchPacketBothEasySymResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendPunchPacketBothEasySymResponse.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.isBusy != null && $Object.hasOwnProperty.call(message, "isBusy") && message.isBusy !== false)
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isBusy);
            if (message.baseMappedAddr != null && $Object.hasOwnProperty.call(message, "baseMappedAddr"))
                $root.common.SocketAddr.encode(message.baseMappedAddr, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a SendPunchPacketBothEasySymResponse message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.SendPunchPacketBothEasySymResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.SendPunchPacketBothEasySymResponse & peer_rpc.SendPunchPacketBothEasySymResponse.$Shape} SendPunchPacketBothEasySymResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendPunchPacketBothEasySymResponse.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.SendPunchPacketBothEasySymResponse(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.isBusy = value;
                        else
                            delete message.isBusy;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.baseMappedAddr = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.baseMappedAddr);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return SendPunchPacketBothEasySymResponse;
    })();

    peer_rpc.TcpHolePunchRequest = (function() {

        /**
         * Properties of a TcpHolePunchRequest.
         * @typedef {Object} peer_rpc.TcpHolePunchRequest.$Properties
         * @property {common.SocketAddr.$Properties|null} [connectorMappedAddr] TcpHolePunchRequest connectorMappedAddr
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a TcpHolePunchRequest.
         * @memberof peer_rpc
         * @interface ITcpHolePunchRequest
         * @augments peer_rpc.TcpHolePunchRequest.$Properties
         * @deprecated Use peer_rpc.TcpHolePunchRequest.$Properties instead.
         */

        /**
         * Shape of a TcpHolePunchRequest.
         * @typedef {{
         *   connectorMappedAddr?: common.SocketAddr.$Shape|null;
         *   $unknowns?: Array.<Uint8Array>;
         * }} peer_rpc.TcpHolePunchRequest.$Shape
         */

        /**
         * Constructs a new TcpHolePunchRequest.
         * @memberof peer_rpc
         * @classdesc Represents a TcpHolePunchRequest.
         * @constructor
         * @param {peer_rpc.TcpHolePunchRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const TcpHolePunchRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * TcpHolePunchRequest connectorMappedAddr.
         * @member {common.SocketAddr.$Properties|null|undefined} connectorMappedAddr
         * @memberof peer_rpc.TcpHolePunchRequest
         * @instance
         */
        TcpHolePunchRequest.prototype.connectorMappedAddr = null;

        /**
         * Encodes the specified TcpHolePunchRequest message. Does not implicitly {@link peer_rpc.TcpHolePunchRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.TcpHolePunchRequest
         * @static
         * @param {peer_rpc.TcpHolePunchRequest.$Properties} message TcpHolePunchRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TcpHolePunchRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.connectorMappedAddr != null && $Object.hasOwnProperty.call(message, "connectorMappedAddr"))
                $root.common.SocketAddr.encode(message.connectorMappedAddr, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a TcpHolePunchRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.TcpHolePunchRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.TcpHolePunchRequest & peer_rpc.TcpHolePunchRequest.$Shape} TcpHolePunchRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TcpHolePunchRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.TcpHolePunchRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.connectorMappedAddr = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.connectorMappedAddr);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return TcpHolePunchRequest;
    })();

    peer_rpc.TcpHolePunchResponse = (function() {

        /**
         * Properties of a TcpHolePunchResponse.
         * @typedef {Object} peer_rpc.TcpHolePunchResponse.$Properties
         * @property {common.SocketAddr.$Properties|null} [listenerMappedAddr] TcpHolePunchResponse listenerMappedAddr
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a TcpHolePunchResponse.
         * @memberof peer_rpc
         * @interface ITcpHolePunchResponse
         * @augments peer_rpc.TcpHolePunchResponse.$Properties
         * @deprecated Use peer_rpc.TcpHolePunchResponse.$Properties instead.
         */

        /**
         * Shape of a TcpHolePunchResponse.
         * @typedef {{
         *   listenerMappedAddr?: common.SocketAddr.$Shape|null;
         *   $unknowns?: Array.<Uint8Array>;
         * }} peer_rpc.TcpHolePunchResponse.$Shape
         */

        /**
         * Constructs a new TcpHolePunchResponse.
         * @memberof peer_rpc
         * @classdesc Represents a TcpHolePunchResponse.
         * @constructor
         * @param {peer_rpc.TcpHolePunchResponse.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const TcpHolePunchResponse = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * TcpHolePunchResponse listenerMappedAddr.
         * @member {common.SocketAddr.$Properties|null|undefined} listenerMappedAddr
         * @memberof peer_rpc.TcpHolePunchResponse
         * @instance
         */
        TcpHolePunchResponse.prototype.listenerMappedAddr = null;

        /**
         * Encodes the specified TcpHolePunchResponse message. Does not implicitly {@link peer_rpc.TcpHolePunchResponse.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.TcpHolePunchResponse
         * @static
         * @param {peer_rpc.TcpHolePunchResponse.$Properties} message TcpHolePunchResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TcpHolePunchResponse.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.listenerMappedAddr != null && $Object.hasOwnProperty.call(message, "listenerMappedAddr"))
                $root.common.SocketAddr.encode(message.listenerMappedAddr, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a TcpHolePunchResponse message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.TcpHolePunchResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.TcpHolePunchResponse & peer_rpc.TcpHolePunchResponse.$Shape} TcpHolePunchResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TcpHolePunchResponse.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.TcpHolePunchResponse(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.listenerMappedAddr = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.listenerMappedAddr);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return TcpHolePunchResponse;
    })();

    peer_rpc.DirectConnectedPeerInfo = (function() {

        /**
         * Properties of a DirectConnectedPeerInfo.
         * @typedef {Object} peer_rpc.DirectConnectedPeerInfo.$Properties
         * @property {number|null} [latencyMs] DirectConnectedPeerInfo latencyMs
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a DirectConnectedPeerInfo.
         * @memberof peer_rpc
         * @interface IDirectConnectedPeerInfo
         * @augments peer_rpc.DirectConnectedPeerInfo.$Properties
         * @deprecated Use peer_rpc.DirectConnectedPeerInfo.$Properties instead.
         */

        /**
         * Shape of a DirectConnectedPeerInfo.
         * @typedef {peer_rpc.DirectConnectedPeerInfo.$Properties} peer_rpc.DirectConnectedPeerInfo.$Shape
         */

        /**
         * Constructs a new DirectConnectedPeerInfo.
         * @memberof peer_rpc
         * @classdesc Represents a DirectConnectedPeerInfo.
         * @constructor
         * @param {peer_rpc.DirectConnectedPeerInfo.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const DirectConnectedPeerInfo = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * DirectConnectedPeerInfo latencyMs.
         * @member {number} latencyMs
         * @memberof peer_rpc.DirectConnectedPeerInfo
         * @instance
         */
        DirectConnectedPeerInfo.prototype.latencyMs = 0;

        /**
         * Encodes the specified DirectConnectedPeerInfo message. Does not implicitly {@link peer_rpc.DirectConnectedPeerInfo.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.DirectConnectedPeerInfo
         * @static
         * @param {peer_rpc.DirectConnectedPeerInfo.$Properties} message DirectConnectedPeerInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DirectConnectedPeerInfo.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.latencyMs != null && $Object.hasOwnProperty.call(message, "latencyMs") && message.latencyMs !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.latencyMs);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a DirectConnectedPeerInfo message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.DirectConnectedPeerInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.DirectConnectedPeerInfo & peer_rpc.DirectConnectedPeerInfo.$Shape} DirectConnectedPeerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DirectConnectedPeerInfo.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.DirectConnectedPeerInfo(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.latencyMs = value;
                        else
                            delete message.latencyMs;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return DirectConnectedPeerInfo;
    })();

    peer_rpc.PeerInfoForGlobalMap = (function() {

        /**
         * Properties of a PeerInfoForGlobalMap.
         * @typedef {Object} peer_rpc.PeerInfoForGlobalMap.$Properties
         * @property {Object.<string,peer_rpc.DirectConnectedPeerInfo.$Properties>|null} [directPeers] PeerInfoForGlobalMap directPeers
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a PeerInfoForGlobalMap.
         * @memberof peer_rpc
         * @interface IPeerInfoForGlobalMap
         * @augments peer_rpc.PeerInfoForGlobalMap.$Properties
         * @deprecated Use peer_rpc.PeerInfoForGlobalMap.$Properties instead.
         */

        /**
         * Shape of a PeerInfoForGlobalMap.
         * @typedef {peer_rpc.PeerInfoForGlobalMap.$Properties} peer_rpc.PeerInfoForGlobalMap.$Shape
         */

        /**
         * Constructs a new PeerInfoForGlobalMap.
         * @memberof peer_rpc
         * @classdesc Represents a PeerInfoForGlobalMap.
         * @constructor
         * @param {peer_rpc.PeerInfoForGlobalMap.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const PeerInfoForGlobalMap = function (properties) {
            this.directPeers = {};
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * PeerInfoForGlobalMap directPeers.
         * @member {Object.<string,peer_rpc.DirectConnectedPeerInfo.$Properties>} directPeers
         * @memberof peer_rpc.PeerInfoForGlobalMap
         * @instance
         */
        PeerInfoForGlobalMap.prototype.directPeers = $util.emptyObject;

        /**
         * Encodes the specified PeerInfoForGlobalMap message. Does not implicitly {@link peer_rpc.PeerInfoForGlobalMap.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.PeerInfoForGlobalMap
         * @static
         * @param {peer_rpc.PeerInfoForGlobalMap.$Properties} message PeerInfoForGlobalMap message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PeerInfoForGlobalMap.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.directPeers != null && $Object.hasOwnProperty.call(message, "directPeers"))
                for (let keys = $Object.keys(message.directPeers), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 0 =*/8).uint32(keys[i]);
                    $root.peer_rpc.DirectConnectedPeerInfo.encode(message.directPeers[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim().ldelim();
                }
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a PeerInfoForGlobalMap message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.PeerInfoForGlobalMap
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.PeerInfoForGlobalMap & peer_rpc.PeerInfoForGlobalMap.$Shape} PeerInfoForGlobalMap
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PeerInfoForGlobalMap.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.PeerInfoForGlobalMap(), key, value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (message.directPeers === $util.emptyObject)
                            message.directPeers = {};
                        let end2 = reader.uint32() + reader.pos;
                        key = 0;
                        value = null;
                        while (reader.pos < end2) {
                            let tag2 = reader.tag();
                            wireType = tag2 & 7;
                            switch (tag2 >>>= 3) {
                            case 1:
                                if (wireType !== 0)
                                    break;
                                key = reader.uint32();
                                continue;
                            case 2:
                                if (wireType !== 2)
                                    break;
                                value = $root.peer_rpc.DirectConnectedPeerInfo.decode(reader, reader.uint32(), $undefined, _depth + 1, value);
                                continue;
                            }
                            reader.skipType(wireType, _depth, tag2);
                        }
                        message.directPeers[key] = value || new $root.peer_rpc.DirectConnectedPeerInfo();
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return PeerInfoForGlobalMap;
    })();

    peer_rpc.ReportPeersRequest = (function() {

        /**
         * Properties of a ReportPeersRequest.
         * @typedef {Object} peer_rpc.ReportPeersRequest.$Properties
         * @property {number|null} [myPeerId] ReportPeersRequest myPeerId
         * @property {peer_rpc.PeerInfoForGlobalMap.$Properties|null} [peerInfos] ReportPeersRequest peerInfos
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a ReportPeersRequest.
         * @memberof peer_rpc
         * @interface IReportPeersRequest
         * @augments peer_rpc.ReportPeersRequest.$Properties
         * @deprecated Use peer_rpc.ReportPeersRequest.$Properties instead.
         */

        /**
         * Shape of a ReportPeersRequest.
         * @typedef {peer_rpc.ReportPeersRequest.$Properties} peer_rpc.ReportPeersRequest.$Shape
         */

        /**
         * Constructs a new ReportPeersRequest.
         * @memberof peer_rpc
         * @classdesc Represents a ReportPeersRequest.
         * @constructor
         * @param {peer_rpc.ReportPeersRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const ReportPeersRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * ReportPeersRequest myPeerId.
         * @member {number} myPeerId
         * @memberof peer_rpc.ReportPeersRequest
         * @instance
         */
        ReportPeersRequest.prototype.myPeerId = 0;

        /**
         * ReportPeersRequest peerInfos.
         * @member {peer_rpc.PeerInfoForGlobalMap.$Properties|null|undefined} peerInfos
         * @memberof peer_rpc.ReportPeersRequest
         * @instance
         */
        ReportPeersRequest.prototype.peerInfos = null;

        /**
         * Encodes the specified ReportPeersRequest message. Does not implicitly {@link peer_rpc.ReportPeersRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.ReportPeersRequest
         * @static
         * @param {peer_rpc.ReportPeersRequest.$Properties} message ReportPeersRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReportPeersRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.myPeerId != null && $Object.hasOwnProperty.call(message, "myPeerId") && message.myPeerId !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.myPeerId);
            if (message.peerInfos != null && $Object.hasOwnProperty.call(message, "peerInfos"))
                $root.peer_rpc.PeerInfoForGlobalMap.encode(message.peerInfos, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a ReportPeersRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.ReportPeersRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.ReportPeersRequest & peer_rpc.ReportPeersRequest.$Shape} ReportPeersRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReportPeersRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.ReportPeersRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.myPeerId = value;
                        else
                            delete message.myPeerId;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.peerInfos = $root.peer_rpc.PeerInfoForGlobalMap.decode(reader, reader.uint32(), $undefined, _depth + 1, message.peerInfos);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return ReportPeersRequest;
    })();

    peer_rpc.ReportPeersResponse = (function() {

        /**
         * Properties of a ReportPeersResponse.
         * @typedef {Object} peer_rpc.ReportPeersResponse.$Properties
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a ReportPeersResponse.
         * @memberof peer_rpc
         * @interface IReportPeersResponse
         * @augments peer_rpc.ReportPeersResponse.$Properties
         * @deprecated Use peer_rpc.ReportPeersResponse.$Properties instead.
         */

        /**
         * Shape of a ReportPeersResponse.
         * @typedef {peer_rpc.ReportPeersResponse.$Properties} peer_rpc.ReportPeersResponse.$Shape
         */

        /**
         * Constructs a new ReportPeersResponse.
         * @memberof peer_rpc
         * @classdesc Represents a ReportPeersResponse.
         * @constructor
         * @param {peer_rpc.ReportPeersResponse.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const ReportPeersResponse = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Encodes the specified ReportPeersResponse message. Does not implicitly {@link peer_rpc.ReportPeersResponse.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.ReportPeersResponse
         * @static
         * @param {peer_rpc.ReportPeersResponse.$Properties} message ReportPeersResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReportPeersResponse.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a ReportPeersResponse message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.ReportPeersResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.ReportPeersResponse & peer_rpc.ReportPeersResponse.$Shape} ReportPeersResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReportPeersResponse.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.ReportPeersResponse();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                reader.skipType(tag & 7, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return ReportPeersResponse;
    })();

    peer_rpc.GlobalPeerMap = (function() {

        /**
         * Properties of a GlobalPeerMap.
         * @typedef {Object} peer_rpc.GlobalPeerMap.$Properties
         * @property {Object.<string,peer_rpc.PeerInfoForGlobalMap.$Properties>|null} [map] GlobalPeerMap map
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a GlobalPeerMap.
         * @memberof peer_rpc
         * @interface IGlobalPeerMap
         * @augments peer_rpc.GlobalPeerMap.$Properties
         * @deprecated Use peer_rpc.GlobalPeerMap.$Properties instead.
         */

        /**
         * Shape of a GlobalPeerMap.
         * @typedef {peer_rpc.GlobalPeerMap.$Properties} peer_rpc.GlobalPeerMap.$Shape
         */

        /**
         * Constructs a new GlobalPeerMap.
         * @memberof peer_rpc
         * @classdesc Represents a GlobalPeerMap.
         * @constructor
         * @param {peer_rpc.GlobalPeerMap.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const GlobalPeerMap = function (properties) {
            this.map = {};
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * GlobalPeerMap map.
         * @member {Object.<string,peer_rpc.PeerInfoForGlobalMap.$Properties>} map
         * @memberof peer_rpc.GlobalPeerMap
         * @instance
         */
        GlobalPeerMap.prototype.map = $util.emptyObject;

        /**
         * Encodes the specified GlobalPeerMap message. Does not implicitly {@link peer_rpc.GlobalPeerMap.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.GlobalPeerMap
         * @static
         * @param {peer_rpc.GlobalPeerMap.$Properties} message GlobalPeerMap message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GlobalPeerMap.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.map != null && $Object.hasOwnProperty.call(message, "map"))
                for (let keys = $Object.keys(message.map), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 0 =*/8).uint32(keys[i]);
                    $root.peer_rpc.PeerInfoForGlobalMap.encode(message.map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim().ldelim();
                }
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a GlobalPeerMap message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.GlobalPeerMap
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.GlobalPeerMap & peer_rpc.GlobalPeerMap.$Shape} GlobalPeerMap
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GlobalPeerMap.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.GlobalPeerMap(), key, value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (message.map === $util.emptyObject)
                            message.map = {};
                        let end2 = reader.uint32() + reader.pos;
                        key = 0;
                        value = null;
                        while (reader.pos < end2) {
                            let tag2 = reader.tag();
                            wireType = tag2 & 7;
                            switch (tag2 >>>= 3) {
                            case 1:
                                if (wireType !== 0)
                                    break;
                                key = reader.uint32();
                                continue;
                            case 2:
                                if (wireType !== 2)
                                    break;
                                value = $root.peer_rpc.PeerInfoForGlobalMap.decode(reader, reader.uint32(), $undefined, _depth + 1, value);
                                continue;
                            }
                            reader.skipType(wireType, _depth, tag2);
                        }
                        message.map[key] = value || new $root.peer_rpc.PeerInfoForGlobalMap();
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return GlobalPeerMap;
    })();

    peer_rpc.GetGlobalPeerMapRequest = (function() {

        /**
         * Properties of a GetGlobalPeerMapRequest.
         * @typedef {Object} peer_rpc.GetGlobalPeerMapRequest.$Properties
         * @property {Long|null} [digest] GetGlobalPeerMapRequest digest
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a GetGlobalPeerMapRequest.
         * @memberof peer_rpc
         * @interface IGetGlobalPeerMapRequest
         * @augments peer_rpc.GetGlobalPeerMapRequest.$Properties
         * @deprecated Use peer_rpc.GetGlobalPeerMapRequest.$Properties instead.
         */

        /**
         * Shape of a GetGlobalPeerMapRequest.
         * @typedef {peer_rpc.GetGlobalPeerMapRequest.$Properties} peer_rpc.GetGlobalPeerMapRequest.$Shape
         */

        /**
         * Constructs a new GetGlobalPeerMapRequest.
         * @memberof peer_rpc
         * @classdesc Represents a GetGlobalPeerMapRequest.
         * @constructor
         * @param {peer_rpc.GetGlobalPeerMapRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const GetGlobalPeerMapRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * GetGlobalPeerMapRequest digest.
         * @member {Long} digest
         * @memberof peer_rpc.GetGlobalPeerMapRequest
         * @instance
         */
        GetGlobalPeerMapRequest.prototype.digest = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Encodes the specified GetGlobalPeerMapRequest message. Does not implicitly {@link peer_rpc.GetGlobalPeerMapRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.GetGlobalPeerMapRequest
         * @static
         * @param {peer_rpc.GetGlobalPeerMapRequest.$Properties} message GetGlobalPeerMapRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetGlobalPeerMapRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.digest != null && $Object.hasOwnProperty.call(message, "digest") && (typeof message.digest === "object" ? message.digest.low || message.digest.high : message.digest !== 0))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.digest);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a GetGlobalPeerMapRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.GetGlobalPeerMapRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.GetGlobalPeerMapRequest & peer_rpc.GetGlobalPeerMapRequest.$Shape} GetGlobalPeerMapRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetGlobalPeerMapRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.GetGlobalPeerMapRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.digest = value;
                        else
                            delete message.digest;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return GetGlobalPeerMapRequest;
    })();

    peer_rpc.GetGlobalPeerMapResponse = (function() {

        /**
         * Properties of a GetGlobalPeerMapResponse.
         * @typedef {Object} peer_rpc.GetGlobalPeerMapResponse.$Properties
         * @property {Object.<string,peer_rpc.PeerInfoForGlobalMap.$Properties>|null} [globalPeerMap] GetGlobalPeerMapResponse globalPeerMap
         * @property {Long|null} [digest] GetGlobalPeerMapResponse digest
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a GetGlobalPeerMapResponse.
         * @memberof peer_rpc
         * @interface IGetGlobalPeerMapResponse
         * @augments peer_rpc.GetGlobalPeerMapResponse.$Properties
         * @deprecated Use peer_rpc.GetGlobalPeerMapResponse.$Properties instead.
         */

        /**
         * Shape of a GetGlobalPeerMapResponse.
         * @typedef {peer_rpc.GetGlobalPeerMapResponse.$Properties} peer_rpc.GetGlobalPeerMapResponse.$Shape
         */

        /**
         * Constructs a new GetGlobalPeerMapResponse.
         * @memberof peer_rpc
         * @classdesc Represents a GetGlobalPeerMapResponse.
         * @constructor
         * @param {peer_rpc.GetGlobalPeerMapResponse.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const GetGlobalPeerMapResponse = function (properties) {
            this.globalPeerMap = {};
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * GetGlobalPeerMapResponse globalPeerMap.
         * @member {Object.<string,peer_rpc.PeerInfoForGlobalMap.$Properties>} globalPeerMap
         * @memberof peer_rpc.GetGlobalPeerMapResponse
         * @instance
         */
        GetGlobalPeerMapResponse.prototype.globalPeerMap = $util.emptyObject;

        /**
         * GetGlobalPeerMapResponse digest.
         * @member {Long|null|undefined} digest
         * @memberof peer_rpc.GetGlobalPeerMapResponse
         * @instance
         */
        GetGlobalPeerMapResponse.prototype.digest = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(GetGlobalPeerMapResponse.prototype, "_digest", {
            get: $util.oneOfGetter($oneOfFields = ["digest"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified GetGlobalPeerMapResponse message. Does not implicitly {@link peer_rpc.GetGlobalPeerMapResponse.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.GetGlobalPeerMapResponse
         * @static
         * @param {peer_rpc.GetGlobalPeerMapResponse.$Properties} message GetGlobalPeerMapResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetGlobalPeerMapResponse.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.globalPeerMap != null && $Object.hasOwnProperty.call(message, "globalPeerMap"))
                for (let keys = $Object.keys(message.globalPeerMap), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 0 =*/8).uint32(keys[i]);
                    $root.peer_rpc.PeerInfoForGlobalMap.encode(message.globalPeerMap[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim().ldelim();
                }
            if (message.digest != null && $Object.hasOwnProperty.call(message, "digest"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.digest);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a GetGlobalPeerMapResponse message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.GetGlobalPeerMapResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.GetGlobalPeerMapResponse & peer_rpc.GetGlobalPeerMapResponse.$Shape} GetGlobalPeerMapResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetGlobalPeerMapResponse.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.GetGlobalPeerMapResponse(), key, value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if (message.globalPeerMap === $util.emptyObject)
                            message.globalPeerMap = {};
                        let end2 = reader.uint32() + reader.pos;
                        key = 0;
                        value = null;
                        while (reader.pos < end2) {
                            let tag2 = reader.tag();
                            wireType = tag2 & 7;
                            switch (tag2 >>>= 3) {
                            case 1:
                                if (wireType !== 0)
                                    break;
                                key = reader.uint32();
                                continue;
                            case 2:
                                if (wireType !== 2)
                                    break;
                                value = $root.peer_rpc.PeerInfoForGlobalMap.decode(reader, reader.uint32(), $undefined, _depth + 1, value);
                                continue;
                            }
                            reader.skipType(wireType, _depth, tag2);
                        }
                        message.globalPeerMap[key] = value || new $root.peer_rpc.PeerInfoForGlobalMap();
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        message.digest = reader.uint64();
                        message._digest = "digest";
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return GetGlobalPeerMapResponse;
    })();

    peer_rpc.HandshakeRequest = (function() {

        /**
         * Properties of a HandshakeRequest.
         * @typedef {Object} peer_rpc.HandshakeRequest.$Properties
         * @property {number|null} [magic] HandshakeRequest magic
         * @property {number|null} [myPeerId] HandshakeRequest myPeerId
         * @property {number|null} [version] HandshakeRequest version
         * @property {Array.<string>|null} [features] HandshakeRequest features
         * @property {string|null} [networkName] HandshakeRequest networkName
         * @property {Uint8Array|null} [networkSecretDigest] HandshakeRequest networkSecretDigest
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a HandshakeRequest.
         * @memberof peer_rpc
         * @interface IHandshakeRequest
         * @augments peer_rpc.HandshakeRequest.$Properties
         * @deprecated Use peer_rpc.HandshakeRequest.$Properties instead.
         */

        /**
         * Shape of a HandshakeRequest.
         * @typedef {peer_rpc.HandshakeRequest.$Properties} peer_rpc.HandshakeRequest.$Shape
         */

        /**
         * Constructs a new HandshakeRequest.
         * @memberof peer_rpc
         * @classdesc Represents a HandshakeRequest.
         * @constructor
         * @param {peer_rpc.HandshakeRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const HandshakeRequest = function (properties) {
            this.features = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * HandshakeRequest magic.
         * @member {number} magic
         * @memberof peer_rpc.HandshakeRequest
         * @instance
         */
        HandshakeRequest.prototype.magic = 0;

        /**
         * HandshakeRequest myPeerId.
         * @member {number} myPeerId
         * @memberof peer_rpc.HandshakeRequest
         * @instance
         */
        HandshakeRequest.prototype.myPeerId = 0;

        /**
         * HandshakeRequest version.
         * @member {number} version
         * @memberof peer_rpc.HandshakeRequest
         * @instance
         */
        HandshakeRequest.prototype.version = 0;

        /**
         * HandshakeRequest features.
         * @member {Array.<string>} features
         * @memberof peer_rpc.HandshakeRequest
         * @instance
         */
        HandshakeRequest.prototype.features = $util.emptyArray;

        /**
         * HandshakeRequest networkName.
         * @member {string} networkName
         * @memberof peer_rpc.HandshakeRequest
         * @instance
         */
        HandshakeRequest.prototype.networkName = "";

        /**
         * HandshakeRequest networkSecretDigest.
         * @member {Uint8Array} networkSecretDigest
         * @memberof peer_rpc.HandshakeRequest
         * @instance
         */
        HandshakeRequest.prototype.networkSecretDigest = $util.newBuffer([]);

        /**
         * Encodes the specified HandshakeRequest message. Does not implicitly {@link peer_rpc.HandshakeRequest.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.HandshakeRequest
         * @static
         * @param {peer_rpc.HandshakeRequest.$Properties} message HandshakeRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HandshakeRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.magic != null && $Object.hasOwnProperty.call(message, "magic") && message.magic !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.magic);
            if (message.myPeerId != null && $Object.hasOwnProperty.call(message, "myPeerId") && message.myPeerId !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.myPeerId);
            if (message.version != null && $Object.hasOwnProperty.call(message, "version") && message.version !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.version);
            if (message.features != null && message.features.length)
                for (let i = 0; i < message.features.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.features[i]);
            if (message.networkName != null && $Object.hasOwnProperty.call(message, "networkName") && message.networkName !== "")
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.networkName);
            if (message.networkSecretDigest != null && $Object.hasOwnProperty.call(message, "networkSecretDigest") && message.networkSecretDigest.length)
                writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.networkSecretDigest);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a HandshakeRequest message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.HandshakeRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.HandshakeRequest & peer_rpc.HandshakeRequest.$Shape} HandshakeRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HandshakeRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.HandshakeRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.magic = value;
                        else
                            delete message.magic;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.myPeerId = value;
                        else
                            delete message.myPeerId;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.version = value;
                        else
                            delete message.version;
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        if (!(message.features && message.features.length))
                            message.features = [];
                        message.features.push(reader.stringVerify());
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.networkName = value;
                        else
                            delete message.networkName;
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.networkSecretDigest = value;
                        else
                            delete message.networkSecretDigest;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return HandshakeRequest;
    })();

    peer_rpc.KcpConnData = (function() {

        /**
         * Properties of a KcpConnData.
         * @typedef {Object} peer_rpc.KcpConnData.$Properties
         * @property {common.SocketAddr.$Properties|null} [src] KcpConnData src
         * @property {common.SocketAddr.$Properties|null} [dst] KcpConnData dst
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a KcpConnData.
         * @memberof peer_rpc
         * @interface IKcpConnData
         * @augments peer_rpc.KcpConnData.$Properties
         * @deprecated Use peer_rpc.KcpConnData.$Properties instead.
         */

        /**
         * Shape of a KcpConnData.
         * @typedef {{
         *   src?: common.SocketAddr.$Shape|null;
         *   dst?: common.SocketAddr.$Shape|null;
         *   $unknowns?: Array.<Uint8Array>;
         * }} peer_rpc.KcpConnData.$Shape
         */

        /**
         * Constructs a new KcpConnData.
         * @memberof peer_rpc
         * @classdesc Represents a KcpConnData.
         * @constructor
         * @param {peer_rpc.KcpConnData.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const KcpConnData = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * KcpConnData src.
         * @member {common.SocketAddr.$Properties|null|undefined} src
         * @memberof peer_rpc.KcpConnData
         * @instance
         */
        KcpConnData.prototype.src = null;

        /**
         * KcpConnData dst.
         * @member {common.SocketAddr.$Properties|null|undefined} dst
         * @memberof peer_rpc.KcpConnData
         * @instance
         */
        KcpConnData.prototype.dst = null;

        /**
         * Encodes the specified KcpConnData message. Does not implicitly {@link peer_rpc.KcpConnData.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.KcpConnData
         * @static
         * @param {peer_rpc.KcpConnData.$Properties} message KcpConnData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KcpConnData.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.src != null && $Object.hasOwnProperty.call(message, "src"))
                $root.common.SocketAddr.encode(message.src, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.dst != null && $Object.hasOwnProperty.call(message, "dst"))
                $root.common.SocketAddr.encode(message.dst, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a KcpConnData message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.KcpConnData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.KcpConnData & peer_rpc.KcpConnData.$Shape} KcpConnData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KcpConnData.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.KcpConnData(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.src = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.src);
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.dst = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.dst);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return KcpConnData;
    })();

    /**
     * SecureAuthLevel enum.
     * @name peer_rpc.SecureAuthLevel
     * @enum {number}
     * @property {number} None=0 None value
     * @property {number} EncryptedUnauthenticated=1 EncryptedUnauthenticated value
     * @property {number} PeerVerified=2 PeerVerified value
     * @property {number} NetworkSecretConfirmed=3 NetworkSecretConfirmed value
     */
    peer_rpc.SecureAuthLevel = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "None"] = 0;
        values[valuesById[1] = "EncryptedUnauthenticated"] = 1;
        values[valuesById[2] = "PeerVerified"] = 2;
        values[valuesById[3] = "NetworkSecretConfirmed"] = 3;
        return values;
    })();

    /**
     * PeerIdentityType enum.
     * @name peer_rpc.PeerIdentityType
     * @enum {number}
     * @property {number} Admin=0 Admin value
     * @property {number} Credential=1 Credential value
     * @property {number} SharedNode=2 SharedNode value
     */
    peer_rpc.PeerIdentityType = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "Admin"] = 0;
        values[valuesById[1] = "Credential"] = 1;
        values[valuesById[2] = "SharedNode"] = 2;
        return values;
    })();

    /**
     * PeerConnSessionActionPb enum.
     * @name peer_rpc.PeerConnSessionActionPb
     * @enum {number}
     * @property {number} Join=0 Join value
     * @property {number} Sync=1 Sync value
     * @property {number} Create=2 Create value
     */
    peer_rpc.PeerConnSessionActionPb = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "Join"] = 0;
        values[valuesById[1] = "Sync"] = 1;
        values[valuesById[2] = "Create"] = 2;
        return values;
    })();

    peer_rpc.PeerConnNoiseMsg1Pb = (function() {

        /**
         * Properties of a PeerConnNoiseMsg1Pb.
         * @typedef {Object} peer_rpc.PeerConnNoiseMsg1Pb.$Properties
         * @property {number|null} [version] PeerConnNoiseMsg1Pb version
         * @property {string|null} [aNetworkName] PeerConnNoiseMsg1Pb aNetworkName
         * @property {number|null} [aSessionGeneration] PeerConnNoiseMsg1Pb aSessionGeneration
         * @property {common.UUID.$Properties|null} [aConnId] PeerConnNoiseMsg1Pb aConnId
         * @property {string|null} [clientEncryptionAlgorithm] PeerConnNoiseMsg1Pb clientEncryptionAlgorithm
         * @property {Array.<string>|null} [features] PeerConnNoiseMsg1Pb features
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a PeerConnNoiseMsg1Pb.
         * @memberof peer_rpc
         * @interface IPeerConnNoiseMsg1Pb
         * @augments peer_rpc.PeerConnNoiseMsg1Pb.$Properties
         * @deprecated Use peer_rpc.PeerConnNoiseMsg1Pb.$Properties instead.
         */

        /**
         * Shape of a PeerConnNoiseMsg1Pb.
         * @typedef {peer_rpc.PeerConnNoiseMsg1Pb.$Properties} peer_rpc.PeerConnNoiseMsg1Pb.$Shape
         */

        /**
         * Constructs a new PeerConnNoiseMsg1Pb.
         * @memberof peer_rpc
         * @classdesc Represents a PeerConnNoiseMsg1Pb.
         * @constructor
         * @param {peer_rpc.PeerConnNoiseMsg1Pb.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const PeerConnNoiseMsg1Pb = function (properties) {
            this.features = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * PeerConnNoiseMsg1Pb version.
         * @member {number} version
         * @memberof peer_rpc.PeerConnNoiseMsg1Pb
         * @instance
         */
        PeerConnNoiseMsg1Pb.prototype.version = 0;

        /**
         * PeerConnNoiseMsg1Pb aNetworkName.
         * @member {string} aNetworkName
         * @memberof peer_rpc.PeerConnNoiseMsg1Pb
         * @instance
         */
        PeerConnNoiseMsg1Pb.prototype.aNetworkName = "";

        /**
         * PeerConnNoiseMsg1Pb aSessionGeneration.
         * @member {number|null|undefined} aSessionGeneration
         * @memberof peer_rpc.PeerConnNoiseMsg1Pb
         * @instance
         */
        PeerConnNoiseMsg1Pb.prototype.aSessionGeneration = null;

        /**
         * PeerConnNoiseMsg1Pb aConnId.
         * @member {common.UUID.$Properties|null|undefined} aConnId
         * @memberof peer_rpc.PeerConnNoiseMsg1Pb
         * @instance
         */
        PeerConnNoiseMsg1Pb.prototype.aConnId = null;

        /**
         * PeerConnNoiseMsg1Pb clientEncryptionAlgorithm.
         * @member {string} clientEncryptionAlgorithm
         * @memberof peer_rpc.PeerConnNoiseMsg1Pb
         * @instance
         */
        PeerConnNoiseMsg1Pb.prototype.clientEncryptionAlgorithm = "";

        /**
         * PeerConnNoiseMsg1Pb features.
         * @member {Array.<string>} features
         * @memberof peer_rpc.PeerConnNoiseMsg1Pb
         * @instance
         */
        PeerConnNoiseMsg1Pb.prototype.features = $util.emptyArray;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(PeerConnNoiseMsg1Pb.prototype, "_aSessionGeneration", {
            get: $util.oneOfGetter($oneOfFields = ["aSessionGeneration"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified PeerConnNoiseMsg1Pb message. Does not implicitly {@link peer_rpc.PeerConnNoiseMsg1Pb.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.PeerConnNoiseMsg1Pb
         * @static
         * @param {peer_rpc.PeerConnNoiseMsg1Pb.$Properties} message PeerConnNoiseMsg1Pb message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PeerConnNoiseMsg1Pb.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.version != null && $Object.hasOwnProperty.call(message, "version") && message.version !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.version);
            if (message.aNetworkName != null && $Object.hasOwnProperty.call(message, "aNetworkName") && message.aNetworkName !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.aNetworkName);
            if (message.aSessionGeneration != null && $Object.hasOwnProperty.call(message, "aSessionGeneration"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.aSessionGeneration);
            if (message.aConnId != null && $Object.hasOwnProperty.call(message, "aConnId"))
                $root.common.UUID.encode(message.aConnId, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.clientEncryptionAlgorithm != null && $Object.hasOwnProperty.call(message, "clientEncryptionAlgorithm") && message.clientEncryptionAlgorithm !== "")
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.clientEncryptionAlgorithm);
            if (message.features != null && message.features.length)
                for (let i = 0; i < message.features.length; ++i)
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.features[i]);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a PeerConnNoiseMsg1Pb message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.PeerConnNoiseMsg1Pb
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.PeerConnNoiseMsg1Pb & peer_rpc.PeerConnNoiseMsg1Pb.$Shape} PeerConnNoiseMsg1Pb
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PeerConnNoiseMsg1Pb.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.PeerConnNoiseMsg1Pb(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.version = value;
                        else
                            delete message.version;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.aNetworkName = value;
                        else
                            delete message.aNetworkName;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        message.aSessionGeneration = reader.uint32();
                        message._aSessionGeneration = "aSessionGeneration";
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.aConnId = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.aConnId);
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.clientEncryptionAlgorithm = value;
                        else
                            delete message.clientEncryptionAlgorithm;
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        if (!(message.features && message.features.length))
                            message.features = [];
                        message.features.push(reader.stringVerify());
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return PeerConnNoiseMsg1Pb;
    })();

    peer_rpc.PeerConnNoiseMsg2Pb = (function() {

        /**
         * Properties of a PeerConnNoiseMsg2Pb.
         * @typedef {Object} peer_rpc.PeerConnNoiseMsg2Pb.$Properties
         * @property {string|null} [bNetworkName] PeerConnNoiseMsg2Pb bNetworkName
         * @property {number|null} [roleHint] PeerConnNoiseMsg2Pb roleHint
         * @property {peer_rpc.PeerConnSessionActionPb|null} [action] PeerConnNoiseMsg2Pb action
         * @property {number|null} [bSessionGeneration] PeerConnNoiseMsg2Pb bSessionGeneration
         * @property {Uint8Array|null} [rootKey_32] PeerConnNoiseMsg2Pb rootKey_32
         * @property {number|null} [initialEpoch] PeerConnNoiseMsg2Pb initialEpoch
         * @property {common.UUID.$Properties|null} [bConnId] PeerConnNoiseMsg2Pb bConnId
         * @property {common.UUID.$Properties|null} [aConnIdEcho] PeerConnNoiseMsg2Pb aConnIdEcho
         * @property {Uint8Array|null} [secretProof_32] PeerConnNoiseMsg2Pb secretProof_32
         * @property {string|null} [serverEncryptionAlgorithm] PeerConnNoiseMsg2Pb serverEncryptionAlgorithm
         * @property {Array.<string>|null} [features] PeerConnNoiseMsg2Pb features
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a PeerConnNoiseMsg2Pb.
         * @memberof peer_rpc
         * @interface IPeerConnNoiseMsg2Pb
         * @augments peer_rpc.PeerConnNoiseMsg2Pb.$Properties
         * @deprecated Use peer_rpc.PeerConnNoiseMsg2Pb.$Properties instead.
         */

        /**
         * Shape of a PeerConnNoiseMsg2Pb.
         * @typedef {peer_rpc.PeerConnNoiseMsg2Pb.$Properties} peer_rpc.PeerConnNoiseMsg2Pb.$Shape
         */

        /**
         * Constructs a new PeerConnNoiseMsg2Pb.
         * @memberof peer_rpc
         * @classdesc Represents a PeerConnNoiseMsg2Pb.
         * @constructor
         * @param {peer_rpc.PeerConnNoiseMsg2Pb.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const PeerConnNoiseMsg2Pb = function (properties) {
            this.features = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * PeerConnNoiseMsg2Pb bNetworkName.
         * @member {string} bNetworkName
         * @memberof peer_rpc.PeerConnNoiseMsg2Pb
         * @instance
         */
        PeerConnNoiseMsg2Pb.prototype.bNetworkName = "";

        /**
         * PeerConnNoiseMsg2Pb roleHint.
         * @member {number} roleHint
         * @memberof peer_rpc.PeerConnNoiseMsg2Pb
         * @instance
         */
        PeerConnNoiseMsg2Pb.prototype.roleHint = 0;

        /**
         * PeerConnNoiseMsg2Pb action.
         * @member {peer_rpc.PeerConnSessionActionPb} action
         * @memberof peer_rpc.PeerConnNoiseMsg2Pb
         * @instance
         */
        PeerConnNoiseMsg2Pb.prototype.action = 0;

        /**
         * PeerConnNoiseMsg2Pb bSessionGeneration.
         * @member {number} bSessionGeneration
         * @memberof peer_rpc.PeerConnNoiseMsg2Pb
         * @instance
         */
        PeerConnNoiseMsg2Pb.prototype.bSessionGeneration = 0;

        /**
         * PeerConnNoiseMsg2Pb rootKey_32.
         * @member {Uint8Array|null|undefined} rootKey_32
         * @memberof peer_rpc.PeerConnNoiseMsg2Pb
         * @instance
         */
        PeerConnNoiseMsg2Pb.prototype.rootKey_32 = null;

        /**
         * PeerConnNoiseMsg2Pb initialEpoch.
         * @member {number} initialEpoch
         * @memberof peer_rpc.PeerConnNoiseMsg2Pb
         * @instance
         */
        PeerConnNoiseMsg2Pb.prototype.initialEpoch = 0;

        /**
         * PeerConnNoiseMsg2Pb bConnId.
         * @member {common.UUID.$Properties|null|undefined} bConnId
         * @memberof peer_rpc.PeerConnNoiseMsg2Pb
         * @instance
         */
        PeerConnNoiseMsg2Pb.prototype.bConnId = null;

        /**
         * PeerConnNoiseMsg2Pb aConnIdEcho.
         * @member {common.UUID.$Properties|null|undefined} aConnIdEcho
         * @memberof peer_rpc.PeerConnNoiseMsg2Pb
         * @instance
         */
        PeerConnNoiseMsg2Pb.prototype.aConnIdEcho = null;

        /**
         * PeerConnNoiseMsg2Pb secretProof_32.
         * @member {Uint8Array|null|undefined} secretProof_32
         * @memberof peer_rpc.PeerConnNoiseMsg2Pb
         * @instance
         */
        PeerConnNoiseMsg2Pb.prototype.secretProof_32 = null;

        /**
         * PeerConnNoiseMsg2Pb serverEncryptionAlgorithm.
         * @member {string} serverEncryptionAlgorithm
         * @memberof peer_rpc.PeerConnNoiseMsg2Pb
         * @instance
         */
        PeerConnNoiseMsg2Pb.prototype.serverEncryptionAlgorithm = "";

        /**
         * PeerConnNoiseMsg2Pb features.
         * @member {Array.<string>} features
         * @memberof peer_rpc.PeerConnNoiseMsg2Pb
         * @instance
         */
        PeerConnNoiseMsg2Pb.prototype.features = $util.emptyArray;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(PeerConnNoiseMsg2Pb.prototype, "_rootKey_32", {
            get: $util.oneOfGetter($oneOfFields = ["rootKey_32"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(PeerConnNoiseMsg2Pb.prototype, "_secretProof_32", {
            get: $util.oneOfGetter($oneOfFields = ["secretProof_32"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified PeerConnNoiseMsg2Pb message. Does not implicitly {@link peer_rpc.PeerConnNoiseMsg2Pb.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.PeerConnNoiseMsg2Pb
         * @static
         * @param {peer_rpc.PeerConnNoiseMsg2Pb.$Properties} message PeerConnNoiseMsg2Pb message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PeerConnNoiseMsg2Pb.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.bNetworkName != null && $Object.hasOwnProperty.call(message, "bNetworkName") && message.bNetworkName !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.bNetworkName);
            if (message.roleHint != null && $Object.hasOwnProperty.call(message, "roleHint") && message.roleHint !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.roleHint);
            if (message.action != null && $Object.hasOwnProperty.call(message, "action") && message.action !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.action);
            if (message.bSessionGeneration != null && $Object.hasOwnProperty.call(message, "bSessionGeneration") && message.bSessionGeneration !== 0)
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.bSessionGeneration);
            if (message.rootKey_32 != null && $Object.hasOwnProperty.call(message, "rootKey_32"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.rootKey_32);
            if (message.initialEpoch != null && $Object.hasOwnProperty.call(message, "initialEpoch") && message.initialEpoch !== 0)
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.initialEpoch);
            if (message.bConnId != null && $Object.hasOwnProperty.call(message, "bConnId"))
                $root.common.UUID.encode(message.bConnId, writer.uint32(/* id 7, wireType 2 =*/58).fork(), _depth + 1).ldelim();
            if (message.aConnIdEcho != null && $Object.hasOwnProperty.call(message, "aConnIdEcho"))
                $root.common.UUID.encode(message.aConnIdEcho, writer.uint32(/* id 8, wireType 2 =*/66).fork(), _depth + 1).ldelim();
            if (message.secretProof_32 != null && $Object.hasOwnProperty.call(message, "secretProof_32"))
                writer.uint32(/* id 9, wireType 2 =*/74).bytes(message.secretProof_32);
            if (message.serverEncryptionAlgorithm != null && $Object.hasOwnProperty.call(message, "serverEncryptionAlgorithm") && message.serverEncryptionAlgorithm !== "")
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.serverEncryptionAlgorithm);
            if (message.features != null && message.features.length)
                for (let i = 0; i < message.features.length; ++i)
                    writer.uint32(/* id 11, wireType 2 =*/90).string(message.features[i]);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a PeerConnNoiseMsg2Pb message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.PeerConnNoiseMsg2Pb
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.PeerConnNoiseMsg2Pb & peer_rpc.PeerConnNoiseMsg2Pb.$Shape} PeerConnNoiseMsg2Pb
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PeerConnNoiseMsg2Pb.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.PeerConnNoiseMsg2Pb(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.bNetworkName = value;
                        else
                            delete message.bNetworkName;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.roleHint = value;
                        else
                            delete message.roleHint;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.action = value;
                        else
                            delete message.action;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.bSessionGeneration = value;
                        else
                            delete message.bSessionGeneration;
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        message.rootKey_32 = reader.bytes();
                        message._rootKey_32 = "rootKey_32";
                        continue;
                    }
                case 6: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.initialEpoch = value;
                        else
                            delete message.initialEpoch;
                        continue;
                    }
                case 7: {
                        if (wireType !== 2)
                            break;
                        message.bConnId = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.bConnId);
                        continue;
                    }
                case 8: {
                        if (wireType !== 2)
                            break;
                        message.aConnIdEcho = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.aConnIdEcho);
                        continue;
                    }
                case 9: {
                        if (wireType !== 2)
                            break;
                        message.secretProof_32 = reader.bytes();
                        message._secretProof_32 = "secretProof_32";
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.serverEncryptionAlgorithm = value;
                        else
                            delete message.serverEncryptionAlgorithm;
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        if (!(message.features && message.features.length))
                            message.features = [];
                        message.features.push(reader.stringVerify());
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return PeerConnNoiseMsg2Pb;
    })();

    peer_rpc.RelayNoiseMsg1Pb = (function() {

        /**
         * Properties of a RelayNoiseMsg1Pb.
         * @typedef {Object} peer_rpc.RelayNoiseMsg1Pb.$Properties
         * @property {number|null} [version] RelayNoiseMsg1Pb version
         * @property {number|null} [aSessionGeneration] RelayNoiseMsg1Pb aSessionGeneration
         * @property {common.UUID.$Properties|null} [aConnId] RelayNoiseMsg1Pb aConnId
         * @property {string|null} [clientEncryptionAlgorithm] RelayNoiseMsg1Pb clientEncryptionAlgorithm
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RelayNoiseMsg1Pb.
         * @memberof peer_rpc
         * @interface IRelayNoiseMsg1Pb
         * @augments peer_rpc.RelayNoiseMsg1Pb.$Properties
         * @deprecated Use peer_rpc.RelayNoiseMsg1Pb.$Properties instead.
         */

        /**
         * Shape of a RelayNoiseMsg1Pb.
         * @typedef {peer_rpc.RelayNoiseMsg1Pb.$Properties} peer_rpc.RelayNoiseMsg1Pb.$Shape
         */

        /**
         * Constructs a new RelayNoiseMsg1Pb.
         * @memberof peer_rpc
         * @classdesc Represents a RelayNoiseMsg1Pb.
         * @constructor
         * @param {peer_rpc.RelayNoiseMsg1Pb.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RelayNoiseMsg1Pb = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RelayNoiseMsg1Pb version.
         * @member {number} version
         * @memberof peer_rpc.RelayNoiseMsg1Pb
         * @instance
         */
        RelayNoiseMsg1Pb.prototype.version = 0;

        /**
         * RelayNoiseMsg1Pb aSessionGeneration.
         * @member {number|null|undefined} aSessionGeneration
         * @memberof peer_rpc.RelayNoiseMsg1Pb
         * @instance
         */
        RelayNoiseMsg1Pb.prototype.aSessionGeneration = null;

        /**
         * RelayNoiseMsg1Pb aConnId.
         * @member {common.UUID.$Properties|null|undefined} aConnId
         * @memberof peer_rpc.RelayNoiseMsg1Pb
         * @instance
         */
        RelayNoiseMsg1Pb.prototype.aConnId = null;

        /**
         * RelayNoiseMsg1Pb clientEncryptionAlgorithm.
         * @member {string} clientEncryptionAlgorithm
         * @memberof peer_rpc.RelayNoiseMsg1Pb
         * @instance
         */
        RelayNoiseMsg1Pb.prototype.clientEncryptionAlgorithm = "";

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(RelayNoiseMsg1Pb.prototype, "_aSessionGeneration", {
            get: $util.oneOfGetter($oneOfFields = ["aSessionGeneration"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified RelayNoiseMsg1Pb message. Does not implicitly {@link peer_rpc.RelayNoiseMsg1Pb.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.RelayNoiseMsg1Pb
         * @static
         * @param {peer_rpc.RelayNoiseMsg1Pb.$Properties} message RelayNoiseMsg1Pb message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RelayNoiseMsg1Pb.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.version != null && $Object.hasOwnProperty.call(message, "version") && message.version !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.version);
            if (message.aSessionGeneration != null && $Object.hasOwnProperty.call(message, "aSessionGeneration"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.aSessionGeneration);
            if (message.aConnId != null && $Object.hasOwnProperty.call(message, "aConnId"))
                $root.common.UUID.encode(message.aConnId, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.clientEncryptionAlgorithm != null && $Object.hasOwnProperty.call(message, "clientEncryptionAlgorithm") && message.clientEncryptionAlgorithm !== "")
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.clientEncryptionAlgorithm);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RelayNoiseMsg1Pb message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.RelayNoiseMsg1Pb
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.RelayNoiseMsg1Pb & peer_rpc.RelayNoiseMsg1Pb.$Shape} RelayNoiseMsg1Pb
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RelayNoiseMsg1Pb.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.RelayNoiseMsg1Pb(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.version = value;
                        else
                            delete message.version;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        message.aSessionGeneration = reader.uint32();
                        message._aSessionGeneration = "aSessionGeneration";
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.aConnId = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.aConnId);
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.clientEncryptionAlgorithm = value;
                        else
                            delete message.clientEncryptionAlgorithm;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return RelayNoiseMsg1Pb;
    })();

    peer_rpc.RelayNoiseMsg2Pb = (function() {

        /**
         * Properties of a RelayNoiseMsg2Pb.
         * @typedef {Object} peer_rpc.RelayNoiseMsg2Pb.$Properties
         * @property {peer_rpc.PeerConnSessionActionPb|null} [action] RelayNoiseMsg2Pb action
         * @property {number|null} [bSessionGeneration] RelayNoiseMsg2Pb bSessionGeneration
         * @property {Uint8Array|null} [rootKey_32] RelayNoiseMsg2Pb rootKey_32
         * @property {number|null} [initialEpoch] RelayNoiseMsg2Pb initialEpoch
         * @property {common.UUID.$Properties|null} [bConnId] RelayNoiseMsg2Pb bConnId
         * @property {common.UUID.$Properties|null} [aConnIdEcho] RelayNoiseMsg2Pb aConnIdEcho
         * @property {string|null} [serverEncryptionAlgorithm] RelayNoiseMsg2Pb serverEncryptionAlgorithm
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RelayNoiseMsg2Pb.
         * @memberof peer_rpc
         * @interface IRelayNoiseMsg2Pb
         * @augments peer_rpc.RelayNoiseMsg2Pb.$Properties
         * @deprecated Use peer_rpc.RelayNoiseMsg2Pb.$Properties instead.
         */

        /**
         * Shape of a RelayNoiseMsg2Pb.
         * @typedef {peer_rpc.RelayNoiseMsg2Pb.$Properties} peer_rpc.RelayNoiseMsg2Pb.$Shape
         */

        /**
         * Constructs a new RelayNoiseMsg2Pb.
         * @memberof peer_rpc
         * @classdesc Represents a RelayNoiseMsg2Pb.
         * @constructor
         * @param {peer_rpc.RelayNoiseMsg2Pb.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RelayNoiseMsg2Pb = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RelayNoiseMsg2Pb action.
         * @member {peer_rpc.PeerConnSessionActionPb} action
         * @memberof peer_rpc.RelayNoiseMsg2Pb
         * @instance
         */
        RelayNoiseMsg2Pb.prototype.action = 0;

        /**
         * RelayNoiseMsg2Pb bSessionGeneration.
         * @member {number} bSessionGeneration
         * @memberof peer_rpc.RelayNoiseMsg2Pb
         * @instance
         */
        RelayNoiseMsg2Pb.prototype.bSessionGeneration = 0;

        /**
         * RelayNoiseMsg2Pb rootKey_32.
         * @member {Uint8Array|null|undefined} rootKey_32
         * @memberof peer_rpc.RelayNoiseMsg2Pb
         * @instance
         */
        RelayNoiseMsg2Pb.prototype.rootKey_32 = null;

        /**
         * RelayNoiseMsg2Pb initialEpoch.
         * @member {number} initialEpoch
         * @memberof peer_rpc.RelayNoiseMsg2Pb
         * @instance
         */
        RelayNoiseMsg2Pb.prototype.initialEpoch = 0;

        /**
         * RelayNoiseMsg2Pb bConnId.
         * @member {common.UUID.$Properties|null|undefined} bConnId
         * @memberof peer_rpc.RelayNoiseMsg2Pb
         * @instance
         */
        RelayNoiseMsg2Pb.prototype.bConnId = null;

        /**
         * RelayNoiseMsg2Pb aConnIdEcho.
         * @member {common.UUID.$Properties|null|undefined} aConnIdEcho
         * @memberof peer_rpc.RelayNoiseMsg2Pb
         * @instance
         */
        RelayNoiseMsg2Pb.prototype.aConnIdEcho = null;

        /**
         * RelayNoiseMsg2Pb serverEncryptionAlgorithm.
         * @member {string} serverEncryptionAlgorithm
         * @memberof peer_rpc.RelayNoiseMsg2Pb
         * @instance
         */
        RelayNoiseMsg2Pb.prototype.serverEncryptionAlgorithm = "";

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(RelayNoiseMsg2Pb.prototype, "_rootKey_32", {
            get: $util.oneOfGetter($oneOfFields = ["rootKey_32"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified RelayNoiseMsg2Pb message. Does not implicitly {@link peer_rpc.RelayNoiseMsg2Pb.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.RelayNoiseMsg2Pb
         * @static
         * @param {peer_rpc.RelayNoiseMsg2Pb.$Properties} message RelayNoiseMsg2Pb message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RelayNoiseMsg2Pb.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.action != null && $Object.hasOwnProperty.call(message, "action") && message.action !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.action);
            if (message.bSessionGeneration != null && $Object.hasOwnProperty.call(message, "bSessionGeneration") && message.bSessionGeneration !== 0)
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.bSessionGeneration);
            if (message.rootKey_32 != null && $Object.hasOwnProperty.call(message, "rootKey_32"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.rootKey_32);
            if (message.initialEpoch != null && $Object.hasOwnProperty.call(message, "initialEpoch") && message.initialEpoch !== 0)
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.initialEpoch);
            if (message.bConnId != null && $Object.hasOwnProperty.call(message, "bConnId"))
                $root.common.UUID.encode(message.bConnId, writer.uint32(/* id 7, wireType 2 =*/58).fork(), _depth + 1).ldelim();
            if (message.aConnIdEcho != null && $Object.hasOwnProperty.call(message, "aConnIdEcho"))
                $root.common.UUID.encode(message.aConnIdEcho, writer.uint32(/* id 8, wireType 2 =*/66).fork(), _depth + 1).ldelim();
            if (message.serverEncryptionAlgorithm != null && $Object.hasOwnProperty.call(message, "serverEncryptionAlgorithm") && message.serverEncryptionAlgorithm !== "")
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.serverEncryptionAlgorithm);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RelayNoiseMsg2Pb message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.RelayNoiseMsg2Pb
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.RelayNoiseMsg2Pb & peer_rpc.RelayNoiseMsg2Pb.$Shape} RelayNoiseMsg2Pb
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RelayNoiseMsg2Pb.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.RelayNoiseMsg2Pb(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.action = value;
                        else
                            delete message.action;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.bSessionGeneration = value;
                        else
                            delete message.bSessionGeneration;
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        message.rootKey_32 = reader.bytes();
                        message._rootKey_32 = "rootKey_32";
                        continue;
                    }
                case 6: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.initialEpoch = value;
                        else
                            delete message.initialEpoch;
                        continue;
                    }
                case 7: {
                        if (wireType !== 2)
                            break;
                        message.bConnId = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.bConnId);
                        continue;
                    }
                case 8: {
                        if (wireType !== 2)
                            break;
                        message.aConnIdEcho = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.aConnIdEcho);
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.serverEncryptionAlgorithm = value;
                        else
                            delete message.serverEncryptionAlgorithm;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return RelayNoiseMsg2Pb;
    })();

    peer_rpc.PeerConnNoiseMsg3Pb = (function() {

        /**
         * Properties of a PeerConnNoiseMsg3Pb.
         * @typedef {Object} peer_rpc.PeerConnNoiseMsg3Pb.$Properties
         * @property {common.UUID.$Properties|null} [aConnIdEcho] PeerConnNoiseMsg3Pb aConnIdEcho
         * @property {common.UUID.$Properties|null} [bConnIdEcho] PeerConnNoiseMsg3Pb bConnIdEcho
         * @property {Uint8Array|null} [secretProof_32] PeerConnNoiseMsg3Pb secretProof_32
         * @property {Uint8Array|null} [secretDigest] PeerConnNoiseMsg3Pb secretDigest
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a PeerConnNoiseMsg3Pb.
         * @memberof peer_rpc
         * @interface IPeerConnNoiseMsg3Pb
         * @augments peer_rpc.PeerConnNoiseMsg3Pb.$Properties
         * @deprecated Use peer_rpc.PeerConnNoiseMsg3Pb.$Properties instead.
         */

        /**
         * Shape of a PeerConnNoiseMsg3Pb.
         * @typedef {peer_rpc.PeerConnNoiseMsg3Pb.$Properties} peer_rpc.PeerConnNoiseMsg3Pb.$Shape
         */

        /**
         * Constructs a new PeerConnNoiseMsg3Pb.
         * @memberof peer_rpc
         * @classdesc Represents a PeerConnNoiseMsg3Pb.
         * @constructor
         * @param {peer_rpc.PeerConnNoiseMsg3Pb.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const PeerConnNoiseMsg3Pb = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * PeerConnNoiseMsg3Pb aConnIdEcho.
         * @member {common.UUID.$Properties|null|undefined} aConnIdEcho
         * @memberof peer_rpc.PeerConnNoiseMsg3Pb
         * @instance
         */
        PeerConnNoiseMsg3Pb.prototype.aConnIdEcho = null;

        /**
         * PeerConnNoiseMsg3Pb bConnIdEcho.
         * @member {common.UUID.$Properties|null|undefined} bConnIdEcho
         * @memberof peer_rpc.PeerConnNoiseMsg3Pb
         * @instance
         */
        PeerConnNoiseMsg3Pb.prototype.bConnIdEcho = null;

        /**
         * PeerConnNoiseMsg3Pb secretProof_32.
         * @member {Uint8Array|null|undefined} secretProof_32
         * @memberof peer_rpc.PeerConnNoiseMsg3Pb
         * @instance
         */
        PeerConnNoiseMsg3Pb.prototype.secretProof_32 = null;

        /**
         * PeerConnNoiseMsg3Pb secretDigest.
         * @member {Uint8Array} secretDigest
         * @memberof peer_rpc.PeerConnNoiseMsg3Pb
         * @instance
         */
        PeerConnNoiseMsg3Pb.prototype.secretDigest = $util.newBuffer([]);

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(PeerConnNoiseMsg3Pb.prototype, "_secretProof_32", {
            get: $util.oneOfGetter($oneOfFields = ["secretProof_32"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified PeerConnNoiseMsg3Pb message. Does not implicitly {@link peer_rpc.PeerConnNoiseMsg3Pb.verify|verify} messages.
         * @function encode
         * @memberof peer_rpc.PeerConnNoiseMsg3Pb
         * @static
         * @param {peer_rpc.PeerConnNoiseMsg3Pb.$Properties} message PeerConnNoiseMsg3Pb message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PeerConnNoiseMsg3Pb.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.aConnIdEcho != null && $Object.hasOwnProperty.call(message, "aConnIdEcho"))
                $root.common.UUID.encode(message.aConnIdEcho, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.bConnIdEcho != null && $Object.hasOwnProperty.call(message, "bConnIdEcho"))
                $root.common.UUID.encode(message.bConnIdEcho, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.secretProof_32 != null && $Object.hasOwnProperty.call(message, "secretProof_32"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.secretProof_32);
            if (message.secretDigest != null && $Object.hasOwnProperty.call(message, "secretDigest") && message.secretDigest.length)
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.secretDigest);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a PeerConnNoiseMsg3Pb message from the specified reader or buffer.
         * @function decode
         * @memberof peer_rpc.PeerConnNoiseMsg3Pb
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {peer_rpc.PeerConnNoiseMsg3Pb & peer_rpc.PeerConnNoiseMsg3Pb.$Shape} PeerConnNoiseMsg3Pb
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PeerConnNoiseMsg3Pb.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.peer_rpc.PeerConnNoiseMsg3Pb(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.aConnIdEcho = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.aConnIdEcho);
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.bConnIdEcho = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.bConnIdEcho);
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.secretProof_32 = reader.bytes();
                        message._secretProof_32 = "secretProof_32";
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.secretDigest = value;
                        else
                            delete message.secretDigest;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return PeerConnNoiseMsg3Pb;
    })();

    return peer_rpc;
})();

export const google = $root.google = (() => {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    const google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        const protobuf = {};

        protobuf.Timestamp = (function() {

            /**
             * Properties of a Timestamp.
             * @typedef {Object} google.protobuf.Timestamp.$Properties
             * @property {Long|null} [seconds] Timestamp seconds
             * @property {number|null} [nanos] Timestamp nanos
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a Timestamp.
             * @memberof google.protobuf
             * @interface ITimestamp
             * @augments google.protobuf.Timestamp.$Properties
             * @deprecated Use google.protobuf.Timestamp.$Properties instead.
             */

            /**
             * Shape of a Timestamp.
             * @typedef {google.protobuf.Timestamp.$Properties} google.protobuf.Timestamp.$Shape
             */

            /**
             * Constructs a new Timestamp.
             * @memberof google.protobuf
             * @classdesc Represents a Timestamp.
             * @constructor
             * @param {google.protobuf.Timestamp.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const Timestamp = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Timestamp seconds.
             * @member {Long} seconds
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.seconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Timestamp nanos.
             * @member {number} nanos
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.nanos = 0;

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.Timestamp.$Properties} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.seconds != null && $Object.hasOwnProperty.call(message, "seconds") && (typeof message.seconds === "object" ? message.seconds.low || message.seconds.high : message.seconds !== 0))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.seconds);
                if (message.nanos != null && $Object.hasOwnProperty.call(message, "nanos") && message.nanos !== 0)
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nanos);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Timestamp & google.protobuf.Timestamp.$Shape} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.google.protobuf.Timestamp(), value;
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                                message.seconds = value;
                            else
                                delete message.seconds;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.int32())
                                message.nanos = value;
                            else
                                delete message.nanos;
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            return Timestamp;
        })();

        return protobuf;
    })();

    return google;
})();

export const common = $root.common = (() => {

    /**
     * Namespace common.
     * @exports common
     * @namespace
     */
    const common = {};

    common.FlagsInConfig = (function() {

        /**
         * Properties of a FlagsInConfig.
         * @typedef {Object} common.FlagsInConfig.$Properties
         * @property {string|null} [defaultProtocol] FlagsInConfig defaultProtocol
         * @property {string|null} [devName] FlagsInConfig devName
         * @property {boolean|null} [enableEncryption] FlagsInConfig enableEncryption
         * @property {boolean|null} [enableIpv6] FlagsInConfig enableIpv6
         * @property {number|null} [mtu] FlagsInConfig mtu
         * @property {boolean|null} [latencyFirst] FlagsInConfig latencyFirst
         * @property {boolean|null} [enableExitNode] FlagsInConfig enableExitNode
         * @property {boolean|null} [noTun] FlagsInConfig noTun
         * @property {boolean|null} [useSmoltcp] FlagsInConfig useSmoltcp
         * @property {string|null} [relayNetworkWhitelist] FlagsInConfig relayNetworkWhitelist
         * @property {boolean|null} [disableP2p] FlagsInConfig disableP2p
         * @property {boolean|null} [relayAllPeerRpc] FlagsInConfig relayAllPeerRpc
         * @property {boolean|null} [disableUdpHolePunching] FlagsInConfig disableUdpHolePunching
         * @property {boolean|null} [multiThread] FlagsInConfig multiThread
         * @property {common.CompressionAlgoPb|null} [dataCompressAlgo] FlagsInConfig dataCompressAlgo
         * @property {boolean|null} [bindDevice] FlagsInConfig bindDevice
         * @property {boolean|null} [enableKcpProxy] FlagsInConfig enableKcpProxy
         * @property {boolean|null} [disableKcpInput] FlagsInConfig disableKcpInput
         * @property {boolean|null} [disableRelayKcp] FlagsInConfig disableRelayKcp
         * @property {boolean|null} [proxyForwardBySystem] FlagsInConfig proxyForwardBySystem
         * @property {boolean|null} [acceptDns] FlagsInConfig acceptDns
         * @property {boolean|null} [privateMode] FlagsInConfig privateMode
         * @property {boolean|null} [enableQuicProxy] FlagsInConfig enableQuicProxy
         * @property {boolean|null} [disableQuicInput] FlagsInConfig disableQuicInput
         * @property {boolean|null} [disableRelayQuic] FlagsInConfig disableRelayQuic
         * @property {number|null} [quicListenPort] FlagsInConfig quicListenPort
         * @property {Long|null} [foreignRelayBpsLimit] FlagsInConfig foreignRelayBpsLimit
         * @property {number|null} [multiThreadCount] FlagsInConfig multiThreadCount
         * @property {boolean|null} [enableRelayForeignNetworkKcp] FlagsInConfig enableRelayForeignNetworkKcp
         * @property {boolean|null} [enableRelayForeignNetworkQuic] FlagsInConfig enableRelayForeignNetworkQuic
         * @property {string|null} [encryptionAlgorithm] FlagsInConfig encryptionAlgorithm
         * @property {boolean|null} [disableSymHolePunching] FlagsInConfig disableSymHolePunching
         * @property {string|null} [tldDnsZone] FlagsInConfig tldDnsZone
         * @property {boolean|null} [p2pOnly] FlagsInConfig p2pOnly
         * @property {boolean|null} [disableTcpHolePunching] FlagsInConfig disableTcpHolePunching
         * @property {boolean|null} [lazyP2p] FlagsInConfig lazyP2p
         * @property {boolean|null} [needP2p] FlagsInConfig needP2p
         * @property {Long|null} [instanceRecvBpsLimit] FlagsInConfig instanceRecvBpsLimit
         * @property {boolean|null} [disableUpnp] FlagsInConfig disableUpnp
         * @property {boolean|null} [disableRelayData] FlagsInConfig disableRelayData
         * @property {boolean|null} [enableUdpBroadcastRelay] FlagsInConfig enableUdpBroadcastRelay
         * @property {number|null} [socketMark] FlagsInConfig socketMark
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a FlagsInConfig.
         * @memberof common
         * @interface IFlagsInConfig
         * @augments common.FlagsInConfig.$Properties
         * @deprecated Use common.FlagsInConfig.$Properties instead.
         */

        /**
         * Shape of a FlagsInConfig.
         * @typedef {common.FlagsInConfig.$Properties} common.FlagsInConfig.$Shape
         */

        /**
         * Constructs a new FlagsInConfig.
         * @memberof common
         * @classdesc Represents a FlagsInConfig.
         * @constructor
         * @param {common.FlagsInConfig.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const FlagsInConfig = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * FlagsInConfig defaultProtocol.
         * @member {string} defaultProtocol
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.defaultProtocol = "";

        /**
         * FlagsInConfig devName.
         * @member {string} devName
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.devName = "";

        /**
         * FlagsInConfig enableEncryption.
         * @member {boolean} enableEncryption
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.enableEncryption = false;

        /**
         * FlagsInConfig enableIpv6.
         * @member {boolean} enableIpv6
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.enableIpv6 = false;

        /**
         * FlagsInConfig mtu.
         * @member {number} mtu
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.mtu = 0;

        /**
         * FlagsInConfig latencyFirst.
         * @member {boolean} latencyFirst
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.latencyFirst = false;

        /**
         * FlagsInConfig enableExitNode.
         * @member {boolean} enableExitNode
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.enableExitNode = false;

        /**
         * FlagsInConfig noTun.
         * @member {boolean} noTun
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.noTun = false;

        /**
         * FlagsInConfig useSmoltcp.
         * @member {boolean} useSmoltcp
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.useSmoltcp = false;

        /**
         * FlagsInConfig relayNetworkWhitelist.
         * @member {string} relayNetworkWhitelist
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.relayNetworkWhitelist = "";

        /**
         * FlagsInConfig disableP2p.
         * @member {boolean} disableP2p
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.disableP2p = false;

        /**
         * FlagsInConfig relayAllPeerRpc.
         * @member {boolean} relayAllPeerRpc
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.relayAllPeerRpc = false;

        /**
         * FlagsInConfig disableUdpHolePunching.
         * @member {boolean} disableUdpHolePunching
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.disableUdpHolePunching = false;

        /**
         * FlagsInConfig multiThread.
         * @member {boolean} multiThread
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.multiThread = false;

        /**
         * FlagsInConfig dataCompressAlgo.
         * @member {common.CompressionAlgoPb} dataCompressAlgo
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.dataCompressAlgo = 0;

        /**
         * FlagsInConfig bindDevice.
         * @member {boolean} bindDevice
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.bindDevice = false;

        /**
         * FlagsInConfig enableKcpProxy.
         * @member {boolean} enableKcpProxy
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.enableKcpProxy = false;

        /**
         * FlagsInConfig disableKcpInput.
         * @member {boolean} disableKcpInput
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.disableKcpInput = false;

        /**
         * FlagsInConfig disableRelayKcp.
         * @member {boolean} disableRelayKcp
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.disableRelayKcp = false;

        /**
         * FlagsInConfig proxyForwardBySystem.
         * @member {boolean} proxyForwardBySystem
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.proxyForwardBySystem = false;

        /**
         * FlagsInConfig acceptDns.
         * @member {boolean} acceptDns
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.acceptDns = false;

        /**
         * FlagsInConfig privateMode.
         * @member {boolean} privateMode
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.privateMode = false;

        /**
         * FlagsInConfig enableQuicProxy.
         * @member {boolean} enableQuicProxy
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.enableQuicProxy = false;

        /**
         * FlagsInConfig disableQuicInput.
         * @member {boolean} disableQuicInput
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.disableQuicInput = false;

        /**
         * FlagsInConfig disableRelayQuic.
         * @member {boolean} disableRelayQuic
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.disableRelayQuic = false;

        /**
         * FlagsInConfig quicListenPort.
         * @member {number} quicListenPort
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.quicListenPort = 0;

        /**
         * FlagsInConfig foreignRelayBpsLimit.
         * @member {Long} foreignRelayBpsLimit
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.foreignRelayBpsLimit = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * FlagsInConfig multiThreadCount.
         * @member {number} multiThreadCount
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.multiThreadCount = 0;

        /**
         * FlagsInConfig enableRelayForeignNetworkKcp.
         * @member {boolean} enableRelayForeignNetworkKcp
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.enableRelayForeignNetworkKcp = false;

        /**
         * FlagsInConfig enableRelayForeignNetworkQuic.
         * @member {boolean} enableRelayForeignNetworkQuic
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.enableRelayForeignNetworkQuic = false;

        /**
         * FlagsInConfig encryptionAlgorithm.
         * @member {string} encryptionAlgorithm
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.encryptionAlgorithm = "";

        /**
         * FlagsInConfig disableSymHolePunching.
         * @member {boolean} disableSymHolePunching
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.disableSymHolePunching = false;

        /**
         * FlagsInConfig tldDnsZone.
         * @member {string} tldDnsZone
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.tldDnsZone = "";

        /**
         * FlagsInConfig p2pOnly.
         * @member {boolean} p2pOnly
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.p2pOnly = false;

        /**
         * FlagsInConfig disableTcpHolePunching.
         * @member {boolean} disableTcpHolePunching
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.disableTcpHolePunching = false;

        /**
         * FlagsInConfig lazyP2p.
         * @member {boolean} lazyP2p
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.lazyP2p = false;

        /**
         * FlagsInConfig needP2p.
         * @member {boolean} needP2p
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.needP2p = false;

        /**
         * FlagsInConfig instanceRecvBpsLimit.
         * @member {Long} instanceRecvBpsLimit
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.instanceRecvBpsLimit = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * FlagsInConfig disableUpnp.
         * @member {boolean} disableUpnp
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.disableUpnp = false;

        /**
         * FlagsInConfig disableRelayData.
         * @member {boolean} disableRelayData
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.disableRelayData = false;

        /**
         * FlagsInConfig enableUdpBroadcastRelay.
         * @member {boolean} enableUdpBroadcastRelay
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.enableUdpBroadcastRelay = false;

        /**
         * FlagsInConfig socketMark.
         * @member {number|null|undefined} socketMark
         * @memberof common.FlagsInConfig
         * @instance
         */
        FlagsInConfig.prototype.socketMark = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(FlagsInConfig.prototype, "_socketMark", {
            get: $util.oneOfGetter($oneOfFields = ["socketMark"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified FlagsInConfig message. Does not implicitly {@link common.FlagsInConfig.verify|verify} messages.
         * @function encode
         * @memberof common.FlagsInConfig
         * @static
         * @param {common.FlagsInConfig.$Properties} message FlagsInConfig message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FlagsInConfig.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.defaultProtocol != null && $Object.hasOwnProperty.call(message, "defaultProtocol") && message.defaultProtocol !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.defaultProtocol);
            if (message.devName != null && $Object.hasOwnProperty.call(message, "devName") && message.devName !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.devName);
            if (message.enableEncryption != null && $Object.hasOwnProperty.call(message, "enableEncryption") && message.enableEncryption !== false)
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.enableEncryption);
            if (message.enableIpv6 != null && $Object.hasOwnProperty.call(message, "enableIpv6") && message.enableIpv6 !== false)
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.enableIpv6);
            if (message.mtu != null && $Object.hasOwnProperty.call(message, "mtu") && message.mtu !== 0)
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.mtu);
            if (message.latencyFirst != null && $Object.hasOwnProperty.call(message, "latencyFirst") && message.latencyFirst !== false)
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.latencyFirst);
            if (message.enableExitNode != null && $Object.hasOwnProperty.call(message, "enableExitNode") && message.enableExitNode !== false)
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.enableExitNode);
            if (message.noTun != null && $Object.hasOwnProperty.call(message, "noTun") && message.noTun !== false)
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.noTun);
            if (message.useSmoltcp != null && $Object.hasOwnProperty.call(message, "useSmoltcp") && message.useSmoltcp !== false)
                writer.uint32(/* id 9, wireType 0 =*/72).bool(message.useSmoltcp);
            if (message.relayNetworkWhitelist != null && $Object.hasOwnProperty.call(message, "relayNetworkWhitelist") && message.relayNetworkWhitelist !== "")
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.relayNetworkWhitelist);
            if (message.disableP2p != null && $Object.hasOwnProperty.call(message, "disableP2p") && message.disableP2p !== false)
                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.disableP2p);
            if (message.relayAllPeerRpc != null && $Object.hasOwnProperty.call(message, "relayAllPeerRpc") && message.relayAllPeerRpc !== false)
                writer.uint32(/* id 12, wireType 0 =*/96).bool(message.relayAllPeerRpc);
            if (message.disableUdpHolePunching != null && $Object.hasOwnProperty.call(message, "disableUdpHolePunching") && message.disableUdpHolePunching !== false)
                writer.uint32(/* id 13, wireType 0 =*/104).bool(message.disableUdpHolePunching);
            if (message.multiThread != null && $Object.hasOwnProperty.call(message, "multiThread") && message.multiThread !== false)
                writer.uint32(/* id 15, wireType 0 =*/120).bool(message.multiThread);
            if (message.dataCompressAlgo != null && $Object.hasOwnProperty.call(message, "dataCompressAlgo") && message.dataCompressAlgo !== 0)
                writer.uint32(/* id 16, wireType 0 =*/128).int32(message.dataCompressAlgo);
            if (message.bindDevice != null && $Object.hasOwnProperty.call(message, "bindDevice") && message.bindDevice !== false)
                writer.uint32(/* id 17, wireType 0 =*/136).bool(message.bindDevice);
            if (message.enableKcpProxy != null && $Object.hasOwnProperty.call(message, "enableKcpProxy") && message.enableKcpProxy !== false)
                writer.uint32(/* id 18, wireType 0 =*/144).bool(message.enableKcpProxy);
            if (message.disableKcpInput != null && $Object.hasOwnProperty.call(message, "disableKcpInput") && message.disableKcpInput !== false)
                writer.uint32(/* id 19, wireType 0 =*/152).bool(message.disableKcpInput);
            if (message.disableRelayKcp != null && $Object.hasOwnProperty.call(message, "disableRelayKcp") && message.disableRelayKcp !== false)
                writer.uint32(/* id 20, wireType 0 =*/160).bool(message.disableRelayKcp);
            if (message.proxyForwardBySystem != null && $Object.hasOwnProperty.call(message, "proxyForwardBySystem") && message.proxyForwardBySystem !== false)
                writer.uint32(/* id 21, wireType 0 =*/168).bool(message.proxyForwardBySystem);
            if (message.acceptDns != null && $Object.hasOwnProperty.call(message, "acceptDns") && message.acceptDns !== false)
                writer.uint32(/* id 22, wireType 0 =*/176).bool(message.acceptDns);
            if (message.privateMode != null && $Object.hasOwnProperty.call(message, "privateMode") && message.privateMode !== false)
                writer.uint32(/* id 23, wireType 0 =*/184).bool(message.privateMode);
            if (message.enableQuicProxy != null && $Object.hasOwnProperty.call(message, "enableQuicProxy") && message.enableQuicProxy !== false)
                writer.uint32(/* id 24, wireType 0 =*/192).bool(message.enableQuicProxy);
            if (message.disableQuicInput != null && $Object.hasOwnProperty.call(message, "disableQuicInput") && message.disableQuicInput !== false)
                writer.uint32(/* id 25, wireType 0 =*/200).bool(message.disableQuicInput);
            if (message.foreignRelayBpsLimit != null && $Object.hasOwnProperty.call(message, "foreignRelayBpsLimit") && (typeof message.foreignRelayBpsLimit === "object" ? message.foreignRelayBpsLimit.low || message.foreignRelayBpsLimit.high : message.foreignRelayBpsLimit !== 0))
                writer.uint32(/* id 26, wireType 0 =*/208).uint64(message.foreignRelayBpsLimit);
            if (message.multiThreadCount != null && $Object.hasOwnProperty.call(message, "multiThreadCount") && message.multiThreadCount !== 0)
                writer.uint32(/* id 27, wireType 0 =*/216).uint32(message.multiThreadCount);
            if (message.enableRelayForeignNetworkKcp != null && $Object.hasOwnProperty.call(message, "enableRelayForeignNetworkKcp") && message.enableRelayForeignNetworkKcp !== false)
                writer.uint32(/* id 28, wireType 0 =*/224).bool(message.enableRelayForeignNetworkKcp);
            if (message.encryptionAlgorithm != null && $Object.hasOwnProperty.call(message, "encryptionAlgorithm") && message.encryptionAlgorithm !== "")
                writer.uint32(/* id 29, wireType 2 =*/234).string(message.encryptionAlgorithm);
            if (message.disableSymHolePunching != null && $Object.hasOwnProperty.call(message, "disableSymHolePunching") && message.disableSymHolePunching !== false)
                writer.uint32(/* id 30, wireType 0 =*/240).bool(message.disableSymHolePunching);
            if (message.tldDnsZone != null && $Object.hasOwnProperty.call(message, "tldDnsZone") && message.tldDnsZone !== "")
                writer.uint32(/* id 31, wireType 2 =*/250).string(message.tldDnsZone);
            if (message.p2pOnly != null && $Object.hasOwnProperty.call(message, "p2pOnly") && message.p2pOnly !== false)
                writer.uint32(/* id 32, wireType 0 =*/256).bool(message.p2pOnly);
            if (message.quicListenPort != null && $Object.hasOwnProperty.call(message, "quicListenPort") && message.quicListenPort !== 0)
                writer.uint32(/* id 33, wireType 0 =*/264).uint32(message.quicListenPort);
            if (message.disableTcpHolePunching != null && $Object.hasOwnProperty.call(message, "disableTcpHolePunching") && message.disableTcpHolePunching !== false)
                writer.uint32(/* id 34, wireType 0 =*/272).bool(message.disableTcpHolePunching);
            if (message.disableRelayQuic != null && $Object.hasOwnProperty.call(message, "disableRelayQuic") && message.disableRelayQuic !== false)
                writer.uint32(/* id 35, wireType 0 =*/280).bool(message.disableRelayQuic);
            if (message.enableRelayForeignNetworkQuic != null && $Object.hasOwnProperty.call(message, "enableRelayForeignNetworkQuic") && message.enableRelayForeignNetworkQuic !== false)
                writer.uint32(/* id 36, wireType 0 =*/288).bool(message.enableRelayForeignNetworkQuic);
            if (message.lazyP2p != null && $Object.hasOwnProperty.call(message, "lazyP2p") && message.lazyP2p !== false)
                writer.uint32(/* id 37, wireType 0 =*/296).bool(message.lazyP2p);
            if (message.needP2p != null && $Object.hasOwnProperty.call(message, "needP2p") && message.needP2p !== false)
                writer.uint32(/* id 38, wireType 0 =*/304).bool(message.needP2p);
            if (message.instanceRecvBpsLimit != null && $Object.hasOwnProperty.call(message, "instanceRecvBpsLimit") && (typeof message.instanceRecvBpsLimit === "object" ? message.instanceRecvBpsLimit.low || message.instanceRecvBpsLimit.high : message.instanceRecvBpsLimit !== 0))
                writer.uint32(/* id 39, wireType 0 =*/312).uint64(message.instanceRecvBpsLimit);
            if (message.disableUpnp != null && $Object.hasOwnProperty.call(message, "disableUpnp") && message.disableUpnp !== false)
                writer.uint32(/* id 40, wireType 0 =*/320).bool(message.disableUpnp);
            if (message.disableRelayData != null && $Object.hasOwnProperty.call(message, "disableRelayData") && message.disableRelayData !== false)
                writer.uint32(/* id 41, wireType 0 =*/328).bool(message.disableRelayData);
            if (message.enableUdpBroadcastRelay != null && $Object.hasOwnProperty.call(message, "enableUdpBroadcastRelay") && message.enableUdpBroadcastRelay !== false)
                writer.uint32(/* id 42, wireType 0 =*/336).bool(message.enableUdpBroadcastRelay);
            if (message.socketMark != null && $Object.hasOwnProperty.call(message, "socketMark"))
                writer.uint32(/* id 43, wireType 0 =*/344).uint32(message.socketMark);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a FlagsInConfig message from the specified reader or buffer.
         * @function decode
         * @memberof common.FlagsInConfig
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.FlagsInConfig & common.FlagsInConfig.$Shape} FlagsInConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FlagsInConfig.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.FlagsInConfig(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.defaultProtocol = value;
                        else
                            delete message.defaultProtocol;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.devName = value;
                        else
                            delete message.devName;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.enableEncryption = value;
                        else
                            delete message.enableEncryption;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.enableIpv6 = value;
                        else
                            delete message.enableIpv6;
                        continue;
                    }
                case 5: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.mtu = value;
                        else
                            delete message.mtu;
                        continue;
                    }
                case 6: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.latencyFirst = value;
                        else
                            delete message.latencyFirst;
                        continue;
                    }
                case 7: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.enableExitNode = value;
                        else
                            delete message.enableExitNode;
                        continue;
                    }
                case 8: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.noTun = value;
                        else
                            delete message.noTun;
                        continue;
                    }
                case 9: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.useSmoltcp = value;
                        else
                            delete message.useSmoltcp;
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.relayNetworkWhitelist = value;
                        else
                            delete message.relayNetworkWhitelist;
                        continue;
                    }
                case 11: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.disableP2p = value;
                        else
                            delete message.disableP2p;
                        continue;
                    }
                case 12: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.relayAllPeerRpc = value;
                        else
                            delete message.relayAllPeerRpc;
                        continue;
                    }
                case 13: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.disableUdpHolePunching = value;
                        else
                            delete message.disableUdpHolePunching;
                        continue;
                    }
                case 15: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.multiThread = value;
                        else
                            delete message.multiThread;
                        continue;
                    }
                case 16: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.dataCompressAlgo = value;
                        else
                            delete message.dataCompressAlgo;
                        continue;
                    }
                case 17: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.bindDevice = value;
                        else
                            delete message.bindDevice;
                        continue;
                    }
                case 18: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.enableKcpProxy = value;
                        else
                            delete message.enableKcpProxy;
                        continue;
                    }
                case 19: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.disableKcpInput = value;
                        else
                            delete message.disableKcpInput;
                        continue;
                    }
                case 20: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.disableRelayKcp = value;
                        else
                            delete message.disableRelayKcp;
                        continue;
                    }
                case 21: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.proxyForwardBySystem = value;
                        else
                            delete message.proxyForwardBySystem;
                        continue;
                    }
                case 22: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.acceptDns = value;
                        else
                            delete message.acceptDns;
                        continue;
                    }
                case 23: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.privateMode = value;
                        else
                            delete message.privateMode;
                        continue;
                    }
                case 24: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.enableQuicProxy = value;
                        else
                            delete message.enableQuicProxy;
                        continue;
                    }
                case 25: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.disableQuicInput = value;
                        else
                            delete message.disableQuicInput;
                        continue;
                    }
                case 35: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.disableRelayQuic = value;
                        else
                            delete message.disableRelayQuic;
                        continue;
                    }
                case 33: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.quicListenPort = value;
                        else
                            delete message.quicListenPort;
                        continue;
                    }
                case 26: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.foreignRelayBpsLimit = value;
                        else
                            delete message.foreignRelayBpsLimit;
                        continue;
                    }
                case 27: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.multiThreadCount = value;
                        else
                            delete message.multiThreadCount;
                        continue;
                    }
                case 28: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.enableRelayForeignNetworkKcp = value;
                        else
                            delete message.enableRelayForeignNetworkKcp;
                        continue;
                    }
                case 36: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.enableRelayForeignNetworkQuic = value;
                        else
                            delete message.enableRelayForeignNetworkQuic;
                        continue;
                    }
                case 29: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.encryptionAlgorithm = value;
                        else
                            delete message.encryptionAlgorithm;
                        continue;
                    }
                case 30: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.disableSymHolePunching = value;
                        else
                            delete message.disableSymHolePunching;
                        continue;
                    }
                case 31: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.tldDnsZone = value;
                        else
                            delete message.tldDnsZone;
                        continue;
                    }
                case 32: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.p2pOnly = value;
                        else
                            delete message.p2pOnly;
                        continue;
                    }
                case 34: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.disableTcpHolePunching = value;
                        else
                            delete message.disableTcpHolePunching;
                        continue;
                    }
                case 37: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.lazyP2p = value;
                        else
                            delete message.lazyP2p;
                        continue;
                    }
                case 38: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.needP2p = value;
                        else
                            delete message.needP2p;
                        continue;
                    }
                case 39: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.instanceRecvBpsLimit = value;
                        else
                            delete message.instanceRecvBpsLimit;
                        continue;
                    }
                case 40: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.disableUpnp = value;
                        else
                            delete message.disableUpnp;
                        continue;
                    }
                case 41: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.disableRelayData = value;
                        else
                            delete message.disableRelayData;
                        continue;
                    }
                case 42: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.enableUdpBroadcastRelay = value;
                        else
                            delete message.enableUdpBroadcastRelay;
                        continue;
                    }
                case 43: {
                        if (wireType !== 0)
                            break;
                        message.socketMark = reader.uint32();
                        message._socketMark = "socketMark";
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return FlagsInConfig;
    })();

    common.RpcDescriptor = (function() {

        /**
         * Properties of a RpcDescriptor.
         * @typedef {Object} common.RpcDescriptor.$Properties
         * @property {string|null} [domainName] RpcDescriptor domainName
         * @property {string|null} [protoName] RpcDescriptor protoName
         * @property {string|null} [serviceName] RpcDescriptor serviceName
         * @property {number|null} [methodIndex] RpcDescriptor methodIndex
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RpcDescriptor.
         * @memberof common
         * @interface IRpcDescriptor
         * @augments common.RpcDescriptor.$Properties
         * @deprecated Use common.RpcDescriptor.$Properties instead.
         */

        /**
         * Shape of a RpcDescriptor.
         * @typedef {common.RpcDescriptor.$Properties} common.RpcDescriptor.$Shape
         */

        /**
         * Constructs a new RpcDescriptor.
         * @memberof common
         * @classdesc Represents a RpcDescriptor.
         * @constructor
         * @param {common.RpcDescriptor.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RpcDescriptor = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RpcDescriptor domainName.
         * @member {string} domainName
         * @memberof common.RpcDescriptor
         * @instance
         */
        RpcDescriptor.prototype.domainName = "";

        /**
         * RpcDescriptor protoName.
         * @member {string} protoName
         * @memberof common.RpcDescriptor
         * @instance
         */
        RpcDescriptor.prototype.protoName = "";

        /**
         * RpcDescriptor serviceName.
         * @member {string} serviceName
         * @memberof common.RpcDescriptor
         * @instance
         */
        RpcDescriptor.prototype.serviceName = "";

        /**
         * RpcDescriptor methodIndex.
         * @member {number} methodIndex
         * @memberof common.RpcDescriptor
         * @instance
         */
        RpcDescriptor.prototype.methodIndex = 0;

        /**
         * Encodes the specified RpcDescriptor message. Does not implicitly {@link common.RpcDescriptor.verify|verify} messages.
         * @function encode
         * @memberof common.RpcDescriptor
         * @static
         * @param {common.RpcDescriptor.$Properties} message RpcDescriptor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RpcDescriptor.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.domainName != null && $Object.hasOwnProperty.call(message, "domainName") && message.domainName !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.domainName);
            if (message.protoName != null && $Object.hasOwnProperty.call(message, "protoName") && message.protoName !== "")
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.protoName);
            if (message.serviceName != null && $Object.hasOwnProperty.call(message, "serviceName") && message.serviceName !== "")
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.serviceName);
            if (message.methodIndex != null && $Object.hasOwnProperty.call(message, "methodIndex") && message.methodIndex !== 0)
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.methodIndex);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RpcDescriptor message from the specified reader or buffer.
         * @function decode
         * @memberof common.RpcDescriptor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.RpcDescriptor & common.RpcDescriptor.$Shape} RpcDescriptor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RpcDescriptor.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.RpcDescriptor(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.domainName = value;
                        else
                            delete message.domainName;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.protoName = value;
                        else
                            delete message.protoName;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.serviceName = value;
                        else
                            delete message.serviceName;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.methodIndex = value;
                        else
                            delete message.methodIndex;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return RpcDescriptor;
    })();

    common.RpcRequest = (function() {

        /**
         * Properties of a RpcRequest.
         * @typedef {Object} common.RpcRequest.$Properties
         * @property {common.RpcDescriptor.$Properties|null} [descriptor] RpcRequest descriptor
         * @property {Uint8Array|null} [request] RpcRequest request
         * @property {number|null} [timeoutMs] RpcRequest timeoutMs
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RpcRequest.
         * @memberof common
         * @interface IRpcRequest
         * @augments common.RpcRequest.$Properties
         * @deprecated Use common.RpcRequest.$Properties instead.
         */

        /**
         * Shape of a RpcRequest.
         * @typedef {common.RpcRequest.$Properties} common.RpcRequest.$Shape
         */

        /**
         * Constructs a new RpcRequest.
         * @memberof common
         * @classdesc Represents a RpcRequest.
         * @constructor
         * @param {common.RpcRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RpcRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RpcRequest descriptor.
         * @member {common.RpcDescriptor.$Properties|null|undefined} descriptor
         * @memberof common.RpcRequest
         * @instance
         */
        RpcRequest.prototype.descriptor = null;

        /**
         * RpcRequest request.
         * @member {Uint8Array} request
         * @memberof common.RpcRequest
         * @instance
         */
        RpcRequest.prototype.request = $util.newBuffer([]);

        /**
         * RpcRequest timeoutMs.
         * @member {number} timeoutMs
         * @memberof common.RpcRequest
         * @instance
         */
        RpcRequest.prototype.timeoutMs = 0;

        /**
         * Encodes the specified RpcRequest message. Does not implicitly {@link common.RpcRequest.verify|verify} messages.
         * @function encode
         * @memberof common.RpcRequest
         * @static
         * @param {common.RpcRequest.$Properties} message RpcRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RpcRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.descriptor != null && $Object.hasOwnProperty.call(message, "descriptor"))
                $root.common.RpcDescriptor.encode(message.descriptor, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.request != null && $Object.hasOwnProperty.call(message, "request") && message.request.length)
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.request);
            if (message.timeoutMs != null && $Object.hasOwnProperty.call(message, "timeoutMs") && message.timeoutMs !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.timeoutMs);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RpcRequest message from the specified reader or buffer.
         * @function decode
         * @memberof common.RpcRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.RpcRequest & common.RpcRequest.$Shape} RpcRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RpcRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.RpcRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.descriptor = $root.common.RpcDescriptor.decode(reader, reader.uint32(), $undefined, _depth + 1, message.descriptor);
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.request = value;
                        else
                            delete message.request;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.timeoutMs = value;
                        else
                            delete message.timeoutMs;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return RpcRequest;
    })();

    common.DirectRpcRequest = (function() {

        /**
         * Properties of a DirectRpcRequest.
         * @typedef {Object} common.DirectRpcRequest.$Properties
         * @property {string|null} [fullMethodName] DirectRpcRequest fullMethodName
         * @property {Uint8Array|null} [request] DirectRpcRequest request
         * @property {Long|null} [timeoutMs] DirectRpcRequest timeoutMs
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a DirectRpcRequest.
         * @memberof common
         * @interface IDirectRpcRequest
         * @augments common.DirectRpcRequest.$Properties
         * @deprecated Use common.DirectRpcRequest.$Properties instead.
         */

        /**
         * Shape of a DirectRpcRequest.
         * @typedef {common.DirectRpcRequest.$Properties} common.DirectRpcRequest.$Shape
         */

        /**
         * Constructs a new DirectRpcRequest.
         * @memberof common
         * @classdesc Represents a DirectRpcRequest.
         * @constructor
         * @param {common.DirectRpcRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const DirectRpcRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * DirectRpcRequest fullMethodName.
         * @member {string} fullMethodName
         * @memberof common.DirectRpcRequest
         * @instance
         */
        DirectRpcRequest.prototype.fullMethodName = "";

        /**
         * DirectRpcRequest request.
         * @member {Uint8Array} request
         * @memberof common.DirectRpcRequest
         * @instance
         */
        DirectRpcRequest.prototype.request = $util.newBuffer([]);

        /**
         * DirectRpcRequest timeoutMs.
         * @member {Long|null|undefined} timeoutMs
         * @memberof common.DirectRpcRequest
         * @instance
         */
        DirectRpcRequest.prototype.timeoutMs = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(DirectRpcRequest.prototype, "_timeoutMs", {
            get: $util.oneOfGetter($oneOfFields = ["timeoutMs"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified DirectRpcRequest message. Does not implicitly {@link common.DirectRpcRequest.verify|verify} messages.
         * @function encode
         * @memberof common.DirectRpcRequest
         * @static
         * @param {common.DirectRpcRequest.$Properties} message DirectRpcRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DirectRpcRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.fullMethodName != null && $Object.hasOwnProperty.call(message, "fullMethodName") && message.fullMethodName !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.fullMethodName);
            if (message.request != null && $Object.hasOwnProperty.call(message, "request") && message.request.length)
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.request);
            if (message.timeoutMs != null && $Object.hasOwnProperty.call(message, "timeoutMs"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.timeoutMs);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a DirectRpcRequest message from the specified reader or buffer.
         * @function decode
         * @memberof common.DirectRpcRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.DirectRpcRequest & common.DirectRpcRequest.$Shape} DirectRpcRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DirectRpcRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.DirectRpcRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.fullMethodName = value;
                        else
                            delete message.fullMethodName;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.request = value;
                        else
                            delete message.request;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        message.timeoutMs = reader.uint64();
                        message._timeoutMs = "timeoutMs";
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return DirectRpcRequest;
    })();

    common.HostManagementRequest = (function() {

        /**
         * Properties of a HostManagementRequest.
         * @typedef {Object} common.HostManagementRequest.$Properties
         * @property {common.DirectRpcRequest.$Properties|null} [rpc] HostManagementRequest rpc
         * @property {string|null} [preparedConfig] HostManagementRequest preparedConfig
         * @property {common.UUID.$Properties|null} [preparedInstanceId] HostManagementRequest preparedInstanceId
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a HostManagementRequest.
         * @memberof common
         * @interface IHostManagementRequest
         * @augments common.HostManagementRequest.$Properties
         * @deprecated Use common.HostManagementRequest.$Properties instead.
         */

        /**
         * Shape of a HostManagementRequest.
         * @typedef {common.HostManagementRequest.$Properties} common.HostManagementRequest.$Shape
         */

        /**
         * Constructs a new HostManagementRequest.
         * @memberof common
         * @classdesc Represents a HostManagementRequest.
         * @constructor
         * @param {common.HostManagementRequest.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const HostManagementRequest = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * HostManagementRequest rpc.
         * @member {common.DirectRpcRequest.$Properties|null|undefined} rpc
         * @memberof common.HostManagementRequest
         * @instance
         */
        HostManagementRequest.prototype.rpc = null;

        /**
         * HostManagementRequest preparedConfig.
         * @member {string|null|undefined} preparedConfig
         * @memberof common.HostManagementRequest
         * @instance
         */
        HostManagementRequest.prototype.preparedConfig = null;

        /**
         * HostManagementRequest preparedInstanceId.
         * @member {common.UUID.$Properties|null|undefined} preparedInstanceId
         * @memberof common.HostManagementRequest
         * @instance
         */
        HostManagementRequest.prototype.preparedInstanceId = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(HostManagementRequest.prototype, "_preparedConfig", {
            get: $util.oneOfGetter($oneOfFields = ["preparedConfig"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified HostManagementRequest message. Does not implicitly {@link common.HostManagementRequest.verify|verify} messages.
         * @function encode
         * @memberof common.HostManagementRequest
         * @static
         * @param {common.HostManagementRequest.$Properties} message HostManagementRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HostManagementRequest.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.rpc != null && $Object.hasOwnProperty.call(message, "rpc"))
                $root.common.DirectRpcRequest.encode(message.rpc, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.preparedConfig != null && $Object.hasOwnProperty.call(message, "preparedConfig"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.preparedConfig);
            if (message.preparedInstanceId != null && $Object.hasOwnProperty.call(message, "preparedInstanceId"))
                $root.common.UUID.encode(message.preparedInstanceId, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a HostManagementRequest message from the specified reader or buffer.
         * @function decode
         * @memberof common.HostManagementRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.HostManagementRequest & common.HostManagementRequest.$Shape} HostManagementRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HostManagementRequest.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.HostManagementRequest(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.rpc = $root.common.DirectRpcRequest.decode(reader, reader.uint32(), $undefined, _depth + 1, message.rpc);
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.preparedConfig = reader.stringVerify();
                        message._preparedConfig = "preparedConfig";
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.preparedInstanceId = $root.common.UUID.decode(reader, reader.uint32(), $undefined, _depth + 1, message.preparedInstanceId);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return HostManagementRequest;
    })();

    common.RpcResponse = (function() {

        /**
         * Properties of a RpcResponse.
         * @typedef {Object} common.RpcResponse.$Properties
         * @property {Uint8Array|null} [response] RpcResponse response
         * @property {error.Error.$Properties|null} [error] RpcResponse error
         * @property {Long|null} [runtimeUs] RpcResponse runtimeUs
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RpcResponse.
         * @memberof common
         * @interface IRpcResponse
         * @augments common.RpcResponse.$Properties
         * @deprecated Use common.RpcResponse.$Properties instead.
         */

        /**
         * Shape of a RpcResponse.
         * @typedef {{
         *   response?: Uint8Array|null;
         *   error?: error.Error.$Shape|null;
         *   runtimeUs?: Long|null;
         *   $unknowns?: Array.<Uint8Array>;
         * }} common.RpcResponse.$Shape
         */

        /**
         * Constructs a new RpcResponse.
         * @memberof common
         * @classdesc Represents a RpcResponse.
         * @constructor
         * @param {common.RpcResponse.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RpcResponse = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RpcResponse response.
         * @member {Uint8Array} response
         * @memberof common.RpcResponse
         * @instance
         */
        RpcResponse.prototype.response = $util.newBuffer([]);

        /**
         * RpcResponse error.
         * @member {error.Error.$Properties|null|undefined} error
         * @memberof common.RpcResponse
         * @instance
         */
        RpcResponse.prototype.error = null;

        /**
         * RpcResponse runtimeUs.
         * @member {Long} runtimeUs
         * @memberof common.RpcResponse
         * @instance
         */
        RpcResponse.prototype.runtimeUs = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Encodes the specified RpcResponse message. Does not implicitly {@link common.RpcResponse.verify|verify} messages.
         * @function encode
         * @memberof common.RpcResponse
         * @static
         * @param {common.RpcResponse.$Properties} message RpcResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RpcResponse.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.response != null && $Object.hasOwnProperty.call(message, "response") && message.response.length)
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.response);
            if (message.error != null && $Object.hasOwnProperty.call(message, "error"))
                $root.error.Error.encode(message.error, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.runtimeUs != null && $Object.hasOwnProperty.call(message, "runtimeUs") && (typeof message.runtimeUs === "object" ? message.runtimeUs.low || message.runtimeUs.high : message.runtimeUs !== 0))
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.runtimeUs);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RpcResponse message from the specified reader or buffer.
         * @function decode
         * @memberof common.RpcResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.RpcResponse & common.RpcResponse.$Shape} RpcResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RpcResponse.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.RpcResponse(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.response = value;
                        else
                            delete message.response;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.error = $root.error.Error.decode(reader, reader.uint32(), $undefined, _depth + 1, message.error);
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                            message.runtimeUs = value;
                        else
                            delete message.runtimeUs;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return RpcResponse;
    })();

    /**
     * CompressionAlgoPb enum.
     * @name common.CompressionAlgoPb
     * @enum {number}
     * @property {number} Invalid=0 Invalid value
     * @property {number} None=1 None value
     * @property {number} Zstd=2 Zstd value
     */
    common.CompressionAlgoPb = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "Invalid"] = 0;
        values[valuesById[1] = "None"] = 1;
        values[valuesById[2] = "Zstd"] = 2;
        return values;
    })();

    common.RpcCompressionInfo = (function() {

        /**
         * Properties of a RpcCompressionInfo.
         * @typedef {Object} common.RpcCompressionInfo.$Properties
         * @property {common.CompressionAlgoPb|null} [algo] RpcCompressionInfo algo
         * @property {common.CompressionAlgoPb|null} [acceptedAlgo] RpcCompressionInfo acceptedAlgo
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RpcCompressionInfo.
         * @memberof common
         * @interface IRpcCompressionInfo
         * @augments common.RpcCompressionInfo.$Properties
         * @deprecated Use common.RpcCompressionInfo.$Properties instead.
         */

        /**
         * Shape of a RpcCompressionInfo.
         * @typedef {common.RpcCompressionInfo.$Properties} common.RpcCompressionInfo.$Shape
         */

        /**
         * Constructs a new RpcCompressionInfo.
         * @memberof common
         * @classdesc Represents a RpcCompressionInfo.
         * @constructor
         * @param {common.RpcCompressionInfo.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RpcCompressionInfo = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RpcCompressionInfo algo.
         * @member {common.CompressionAlgoPb} algo
         * @memberof common.RpcCompressionInfo
         * @instance
         */
        RpcCompressionInfo.prototype.algo = 0;

        /**
         * RpcCompressionInfo acceptedAlgo.
         * @member {common.CompressionAlgoPb} acceptedAlgo
         * @memberof common.RpcCompressionInfo
         * @instance
         */
        RpcCompressionInfo.prototype.acceptedAlgo = 0;

        /**
         * Encodes the specified RpcCompressionInfo message. Does not implicitly {@link common.RpcCompressionInfo.verify|verify} messages.
         * @function encode
         * @memberof common.RpcCompressionInfo
         * @static
         * @param {common.RpcCompressionInfo.$Properties} message RpcCompressionInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RpcCompressionInfo.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.algo != null && $Object.hasOwnProperty.call(message, "algo") && message.algo !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.algo);
            if (message.acceptedAlgo != null && $Object.hasOwnProperty.call(message, "acceptedAlgo") && message.acceptedAlgo !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.acceptedAlgo);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RpcCompressionInfo message from the specified reader or buffer.
         * @function decode
         * @memberof common.RpcCompressionInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.RpcCompressionInfo & common.RpcCompressionInfo.$Shape} RpcCompressionInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RpcCompressionInfo.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.RpcCompressionInfo(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.algo = value;
                        else
                            delete message.algo;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.acceptedAlgo = value;
                        else
                            delete message.acceptedAlgo;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return RpcCompressionInfo;
    })();

    common.RpcPacket = (function() {

        /**
         * Properties of a RpcPacket.
         * @typedef {Object} common.RpcPacket.$Properties
         * @property {number|null} [fromPeer] RpcPacket fromPeer
         * @property {number|null} [toPeer] RpcPacket toPeer
         * @property {Long|null} [transactionId] RpcPacket transactionId
         * @property {common.RpcDescriptor.$Properties|null} [descriptor] RpcPacket descriptor
         * @property {Uint8Array|null} [body] RpcPacket body
         * @property {boolean|null} [isRequest] RpcPacket isRequest
         * @property {number|null} [totalPieces] RpcPacket totalPieces
         * @property {number|null} [pieceIdx] RpcPacket pieceIdx
         * @property {number|null} [traceId] RpcPacket traceId
         * @property {common.RpcCompressionInfo.$Properties|null} [compressionInfo] RpcPacket compressionInfo
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a RpcPacket.
         * @memberof common
         * @interface IRpcPacket
         * @augments common.RpcPacket.$Properties
         * @deprecated Use common.RpcPacket.$Properties instead.
         */

        /**
         * Shape of a RpcPacket.
         * @typedef {common.RpcPacket.$Properties} common.RpcPacket.$Shape
         */

        /**
         * Constructs a new RpcPacket.
         * @memberof common
         * @classdesc Represents a RpcPacket.
         * @constructor
         * @param {common.RpcPacket.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const RpcPacket = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * RpcPacket fromPeer.
         * @member {number} fromPeer
         * @memberof common.RpcPacket
         * @instance
         */
        RpcPacket.prototype.fromPeer = 0;

        /**
         * RpcPacket toPeer.
         * @member {number} toPeer
         * @memberof common.RpcPacket
         * @instance
         */
        RpcPacket.prototype.toPeer = 0;

        /**
         * RpcPacket transactionId.
         * @member {Long} transactionId
         * @memberof common.RpcPacket
         * @instance
         */
        RpcPacket.prototype.transactionId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * RpcPacket descriptor.
         * @member {common.RpcDescriptor.$Properties|null|undefined} descriptor
         * @memberof common.RpcPacket
         * @instance
         */
        RpcPacket.prototype.descriptor = null;

        /**
         * RpcPacket body.
         * @member {Uint8Array} body
         * @memberof common.RpcPacket
         * @instance
         */
        RpcPacket.prototype.body = $util.newBuffer([]);

        /**
         * RpcPacket isRequest.
         * @member {boolean} isRequest
         * @memberof common.RpcPacket
         * @instance
         */
        RpcPacket.prototype.isRequest = false;

        /**
         * RpcPacket totalPieces.
         * @member {number} totalPieces
         * @memberof common.RpcPacket
         * @instance
         */
        RpcPacket.prototype.totalPieces = 0;

        /**
         * RpcPacket pieceIdx.
         * @member {number} pieceIdx
         * @memberof common.RpcPacket
         * @instance
         */
        RpcPacket.prototype.pieceIdx = 0;

        /**
         * RpcPacket traceId.
         * @member {number} traceId
         * @memberof common.RpcPacket
         * @instance
         */
        RpcPacket.prototype.traceId = 0;

        /**
         * RpcPacket compressionInfo.
         * @member {common.RpcCompressionInfo.$Properties|null|undefined} compressionInfo
         * @memberof common.RpcPacket
         * @instance
         */
        RpcPacket.prototype.compressionInfo = null;

        /**
         * Encodes the specified RpcPacket message. Does not implicitly {@link common.RpcPacket.verify|verify} messages.
         * @function encode
         * @memberof common.RpcPacket
         * @static
         * @param {common.RpcPacket.$Properties} message RpcPacket message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RpcPacket.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.fromPeer != null && $Object.hasOwnProperty.call(message, "fromPeer") && message.fromPeer !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.fromPeer);
            if (message.toPeer != null && $Object.hasOwnProperty.call(message, "toPeer") && message.toPeer !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.toPeer);
            if (message.transactionId != null && $Object.hasOwnProperty.call(message, "transactionId") && (typeof message.transactionId === "object" ? message.transactionId.low || message.transactionId.high : message.transactionId !== 0))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.transactionId);
            if (message.descriptor != null && $Object.hasOwnProperty.call(message, "descriptor"))
                $root.common.RpcDescriptor.encode(message.descriptor, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.body != null && $Object.hasOwnProperty.call(message, "body") && message.body.length)
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.body);
            if (message.isRequest != null && $Object.hasOwnProperty.call(message, "isRequest") && message.isRequest !== false)
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.isRequest);
            if (message.totalPieces != null && $Object.hasOwnProperty.call(message, "totalPieces") && message.totalPieces !== 0)
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.totalPieces);
            if (message.pieceIdx != null && $Object.hasOwnProperty.call(message, "pieceIdx") && message.pieceIdx !== 0)
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.pieceIdx);
            if (message.traceId != null && $Object.hasOwnProperty.call(message, "traceId") && message.traceId !== 0)
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.traceId);
            if (message.compressionInfo != null && $Object.hasOwnProperty.call(message, "compressionInfo"))
                $root.common.RpcCompressionInfo.encode(message.compressionInfo, writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a RpcPacket message from the specified reader or buffer.
         * @function decode
         * @memberof common.RpcPacket
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.RpcPacket & common.RpcPacket.$Shape} RpcPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RpcPacket.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.RpcPacket(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.fromPeer = value;
                        else
                            delete message.fromPeer;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.toPeer = value;
                        else
                            delete message.toPeer;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                            message.transactionId = value;
                        else
                            delete message.transactionId;
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.descriptor = $root.common.RpcDescriptor.decode(reader, reader.uint32(), $undefined, _depth + 1, message.descriptor);
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.bytes()).length)
                            message.body = value;
                        else
                            delete message.body;
                        continue;
                    }
                case 6: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.isRequest = value;
                        else
                            delete message.isRequest;
                        continue;
                    }
                case 7: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.totalPieces = value;
                        else
                            delete message.totalPieces;
                        continue;
                    }
                case 8: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.pieceIdx = value;
                        else
                            delete message.pieceIdx;
                        continue;
                    }
                case 9: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.traceId = value;
                        else
                            delete message.traceId;
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        message.compressionInfo = $root.common.RpcCompressionInfo.decode(reader, reader.uint32(), $undefined, _depth + 1, message.compressionInfo);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return RpcPacket;
    })();

    common.Void = (function() {

        /**
         * Properties of a Void.
         * @typedef {Object} common.Void.$Properties
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Void.
         * @memberof common
         * @interface IVoid
         * @augments common.Void.$Properties
         * @deprecated Use common.Void.$Properties instead.
         */

        /**
         * Shape of a Void.
         * @typedef {common.Void.$Properties} common.Void.$Shape
         */

        /**
         * Constructs a new Void.
         * @memberof common
         * @classdesc Represents a Void.
         * @constructor
         * @param {common.Void.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Void = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Encodes the specified Void message. Does not implicitly {@link common.Void.verify|verify} messages.
         * @function encode
         * @memberof common.Void
         * @static
         * @param {common.Void.$Properties} message Void message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Void.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a Void message from the specified reader or buffer.
         * @function decode
         * @memberof common.Void
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.Void & common.Void.$Shape} Void
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Void.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.Void();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                reader.skipType(tag & 7, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return Void;
    })();

    common.UUID = (function() {

        /**
         * Properties of a UUID.
         * @typedef {Object} common.UUID.$Properties
         * @property {number|null} [part1] UUID part1
         * @property {number|null} [part2] UUID part2
         * @property {number|null} [part3] UUID part3
         * @property {number|null} [part4] UUID part4
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a UUID.
         * @memberof common
         * @interface IUUID
         * @augments common.UUID.$Properties
         * @deprecated Use common.UUID.$Properties instead.
         */

        /**
         * Shape of a UUID.
         * @typedef {common.UUID.$Properties} common.UUID.$Shape
         */

        /**
         * Constructs a new UUID.
         * @memberof common
         * @classdesc Represents a UUID.
         * @constructor
         * @param {common.UUID.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const UUID = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * UUID part1.
         * @member {number} part1
         * @memberof common.UUID
         * @instance
         */
        UUID.prototype.part1 = 0;

        /**
         * UUID part2.
         * @member {number} part2
         * @memberof common.UUID
         * @instance
         */
        UUID.prototype.part2 = 0;

        /**
         * UUID part3.
         * @member {number} part3
         * @memberof common.UUID
         * @instance
         */
        UUID.prototype.part3 = 0;

        /**
         * UUID part4.
         * @member {number} part4
         * @memberof common.UUID
         * @instance
         */
        UUID.prototype.part4 = 0;

        /**
         * Encodes the specified UUID message. Does not implicitly {@link common.UUID.verify|verify} messages.
         * @function encode
         * @memberof common.UUID
         * @static
         * @param {common.UUID.$Properties} message UUID message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UUID.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.part1 != null && $Object.hasOwnProperty.call(message, "part1") && message.part1 !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.part1);
            if (message.part2 != null && $Object.hasOwnProperty.call(message, "part2") && message.part2 !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.part2);
            if (message.part3 != null && $Object.hasOwnProperty.call(message, "part3") && message.part3 !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.part3);
            if (message.part4 != null && $Object.hasOwnProperty.call(message, "part4") && message.part4 !== 0)
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.part4);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a UUID message from the specified reader or buffer.
         * @function decode
         * @memberof common.UUID
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.UUID & common.UUID.$Shape} UUID
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UUID.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.UUID(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.part1 = value;
                        else
                            delete message.part1;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.part2 = value;
                        else
                            delete message.part2;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.part3 = value;
                        else
                            delete message.part3;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.part4 = value;
                        else
                            delete message.part4;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return UUID;
    })();

    /**
     * NatType enum.
     * @name common.NatType
     * @enum {number}
     * @property {number} Unknown=0 Unknown value
     * @property {number} OpenInternet=1 OpenInternet value
     * @property {number} NoPAT=2 NoPAT value
     * @property {number} FullCone=3 FullCone value
     * @property {number} Restricted=4 Restricted value
     * @property {number} PortRestricted=5 PortRestricted value
     * @property {number} Symmetric=6 Symmetric value
     * @property {number} SymUdpFirewall=7 SymUdpFirewall value
     * @property {number} SymmetricEasyInc=8 SymmetricEasyInc value
     * @property {number} SymmetricEasyDec=9 SymmetricEasyDec value
     */
    common.NatType = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "Unknown"] = 0;
        values[valuesById[1] = "OpenInternet"] = 1;
        values[valuesById[2] = "NoPAT"] = 2;
        values[valuesById[3] = "FullCone"] = 3;
        values[valuesById[4] = "Restricted"] = 4;
        values[valuesById[5] = "PortRestricted"] = 5;
        values[valuesById[6] = "Symmetric"] = 6;
        values[valuesById[7] = "SymUdpFirewall"] = 7;
        values[valuesById[8] = "SymmetricEasyInc"] = 8;
        values[valuesById[9] = "SymmetricEasyDec"] = 9;
        return values;
    })();

    common.Ipv4Addr = (function() {

        /**
         * Properties of an Ipv4Addr.
         * @typedef {Object} common.Ipv4Addr.$Properties
         * @property {number|null} [addr] Ipv4Addr addr
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an Ipv4Addr.
         * @memberof common
         * @interface IIpv4Addr
         * @augments common.Ipv4Addr.$Properties
         * @deprecated Use common.Ipv4Addr.$Properties instead.
         */

        /**
         * Shape of an Ipv4Addr.
         * @typedef {common.Ipv4Addr.$Properties} common.Ipv4Addr.$Shape
         */

        /**
         * Constructs a new Ipv4Addr.
         * @memberof common
         * @classdesc Represents an Ipv4Addr.
         * @constructor
         * @param {common.Ipv4Addr.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Ipv4Addr = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Ipv4Addr addr.
         * @member {number} addr
         * @memberof common.Ipv4Addr
         * @instance
         */
        Ipv4Addr.prototype.addr = 0;

        /**
         * Encodes the specified Ipv4Addr message. Does not implicitly {@link common.Ipv4Addr.verify|verify} messages.
         * @function encode
         * @memberof common.Ipv4Addr
         * @static
         * @param {common.Ipv4Addr.$Properties} message Ipv4Addr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Ipv4Addr.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.addr != null && $Object.hasOwnProperty.call(message, "addr") && message.addr !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.addr);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an Ipv4Addr message from the specified reader or buffer.
         * @function decode
         * @memberof common.Ipv4Addr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.Ipv4Addr & common.Ipv4Addr.$Shape} Ipv4Addr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Ipv4Addr.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.Ipv4Addr(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.addr = value;
                        else
                            delete message.addr;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return Ipv4Addr;
    })();

    common.Ipv6Addr = (function() {

        /**
         * Properties of an Ipv6Addr.
         * @typedef {Object} common.Ipv6Addr.$Properties
         * @property {number|null} [part1] Ipv6Addr part1
         * @property {number|null} [part2] Ipv6Addr part2
         * @property {number|null} [part3] Ipv6Addr part3
         * @property {number|null} [part4] Ipv6Addr part4
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an Ipv6Addr.
         * @memberof common
         * @interface IIpv6Addr
         * @augments common.Ipv6Addr.$Properties
         * @deprecated Use common.Ipv6Addr.$Properties instead.
         */

        /**
         * Shape of an Ipv6Addr.
         * @typedef {common.Ipv6Addr.$Properties} common.Ipv6Addr.$Shape
         */

        /**
         * Constructs a new Ipv6Addr.
         * @memberof common
         * @classdesc Represents an Ipv6Addr.
         * @constructor
         * @param {common.Ipv6Addr.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Ipv6Addr = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Ipv6Addr part1.
         * @member {number} part1
         * @memberof common.Ipv6Addr
         * @instance
         */
        Ipv6Addr.prototype.part1 = 0;

        /**
         * Ipv6Addr part2.
         * @member {number} part2
         * @memberof common.Ipv6Addr
         * @instance
         */
        Ipv6Addr.prototype.part2 = 0;

        /**
         * Ipv6Addr part3.
         * @member {number} part3
         * @memberof common.Ipv6Addr
         * @instance
         */
        Ipv6Addr.prototype.part3 = 0;

        /**
         * Ipv6Addr part4.
         * @member {number} part4
         * @memberof common.Ipv6Addr
         * @instance
         */
        Ipv6Addr.prototype.part4 = 0;

        /**
         * Encodes the specified Ipv6Addr message. Does not implicitly {@link common.Ipv6Addr.verify|verify} messages.
         * @function encode
         * @memberof common.Ipv6Addr
         * @static
         * @param {common.Ipv6Addr.$Properties} message Ipv6Addr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Ipv6Addr.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.part1 != null && $Object.hasOwnProperty.call(message, "part1") && message.part1 !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.part1);
            if (message.part2 != null && $Object.hasOwnProperty.call(message, "part2") && message.part2 !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.part2);
            if (message.part3 != null && $Object.hasOwnProperty.call(message, "part3") && message.part3 !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.part3);
            if (message.part4 != null && $Object.hasOwnProperty.call(message, "part4") && message.part4 !== 0)
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.part4);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an Ipv6Addr message from the specified reader or buffer.
         * @function decode
         * @memberof common.Ipv6Addr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.Ipv6Addr & common.Ipv6Addr.$Shape} Ipv6Addr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Ipv6Addr.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.Ipv6Addr(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.part1 = value;
                        else
                            delete message.part1;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.part2 = value;
                        else
                            delete message.part2;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.part3 = value;
                        else
                            delete message.part3;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.part4 = value;
                        else
                            delete message.part4;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return Ipv6Addr;
    })();

    common.IpAddr = (function() {

        /**
         * Properties of an IpAddr.
         * @typedef {Object} common.IpAddr.$Properties
         * @property {common.Ipv4Addr.$Properties|null} [ipv4] IpAddr ipv4
         * @property {common.Ipv6Addr.$Properties|null} [ipv6] IpAddr ipv6
         * @property {"ipv4"|"ipv6"} [ip] IpAddr ip
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an IpAddr.
         * @memberof common
         * @interface IIpAddr
         * @augments common.IpAddr.$Properties
         * @deprecated Use common.IpAddr.$Properties instead.
         */

        /**
         * Narrowed shape of an IpAddr.
         * @typedef {{
         *   ipv4?: common.Ipv4Addr.$Shape|null;
         *   ipv6?: common.Ipv6Addr.$Shape|null;
         *   $unknowns?: Array.<Uint8Array>;
         * } & (
         *   ({ ip?: undefined; ipv4?: null; ipv6?: null }|{ ip?: "ipv4"; ipv4: common.Ipv4Addr.$Shape; ipv6?: null }|{ ip?: "ipv6"; ipv4?: null; ipv6: common.Ipv6Addr.$Shape })
         * )} common.IpAddr.$Shape
         */

        /**
         * Constructs a new IpAddr.
         * @memberof common
         * @classdesc Represents an IpAddr.
         * @constructor
         * @param {common.IpAddr.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const IpAddr = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * IpAddr ipv4.
         * @member {common.Ipv4Addr.$Properties|null|undefined} ipv4
         * @memberof common.IpAddr
         * @instance
         */
        IpAddr.prototype.ipv4 = null;

        /**
         * IpAddr ipv6.
         * @member {common.Ipv6Addr.$Properties|null|undefined} ipv6
         * @memberof common.IpAddr
         * @instance
         */
        IpAddr.prototype.ipv6 = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * IpAddr ip.
         * @member {"ipv4"|"ipv6"|undefined} ip
         * @memberof common.IpAddr
         * @instance
         */
        $Object.defineProperty(IpAddr.prototype, "ip", {
            get: $util.oneOfGetter($oneOfFields = ["ipv4", "ipv6"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified IpAddr message. Does not implicitly {@link common.IpAddr.verify|verify} messages.
         * @function encode
         * @memberof common.IpAddr
         * @static
         * @param {common.IpAddr.$Properties} message IpAddr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IpAddr.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.ipv4 != null && $Object.hasOwnProperty.call(message, "ipv4"))
                $root.common.Ipv4Addr.encode(message.ipv4, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.ipv6 != null && $Object.hasOwnProperty.call(message, "ipv6"))
                $root.common.Ipv6Addr.encode(message.ipv6, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an IpAddr message from the specified reader or buffer.
         * @function decode
         * @memberof common.IpAddr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.IpAddr & common.IpAddr.$Shape} IpAddr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IpAddr.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.IpAddr();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.ipv4 = $root.common.Ipv4Addr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.ipv4);
                        message.ip = "ipv4";
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.ipv6 = $root.common.Ipv6Addr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.ipv6);
                        message.ip = "ipv6";
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return IpAddr;
    })();

    common.Ipv4Inet = (function() {

        /**
         * Properties of an Ipv4Inet.
         * @typedef {Object} common.Ipv4Inet.$Properties
         * @property {common.Ipv4Addr.$Properties|null} [address] Ipv4Inet address
         * @property {number|null} [networkLength] Ipv4Inet networkLength
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an Ipv4Inet.
         * @memberof common
         * @interface IIpv4Inet
         * @augments common.Ipv4Inet.$Properties
         * @deprecated Use common.Ipv4Inet.$Properties instead.
         */

        /**
         * Shape of an Ipv4Inet.
         * @typedef {common.Ipv4Inet.$Properties} common.Ipv4Inet.$Shape
         */

        /**
         * Constructs a new Ipv4Inet.
         * @memberof common
         * @classdesc Represents an Ipv4Inet.
         * @constructor
         * @param {common.Ipv4Inet.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Ipv4Inet = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Ipv4Inet address.
         * @member {common.Ipv4Addr.$Properties|null|undefined} address
         * @memberof common.Ipv4Inet
         * @instance
         */
        Ipv4Inet.prototype.address = null;

        /**
         * Ipv4Inet networkLength.
         * @member {number} networkLength
         * @memberof common.Ipv4Inet
         * @instance
         */
        Ipv4Inet.prototype.networkLength = 0;

        /**
         * Encodes the specified Ipv4Inet message. Does not implicitly {@link common.Ipv4Inet.verify|verify} messages.
         * @function encode
         * @memberof common.Ipv4Inet
         * @static
         * @param {common.Ipv4Inet.$Properties} message Ipv4Inet message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Ipv4Inet.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.address != null && $Object.hasOwnProperty.call(message, "address"))
                $root.common.Ipv4Addr.encode(message.address, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.networkLength != null && $Object.hasOwnProperty.call(message, "networkLength") && message.networkLength !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.networkLength);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an Ipv4Inet message from the specified reader or buffer.
         * @function decode
         * @memberof common.Ipv4Inet
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.Ipv4Inet & common.Ipv4Inet.$Shape} Ipv4Inet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Ipv4Inet.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.Ipv4Inet(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.address = $root.common.Ipv4Addr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.address);
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.networkLength = value;
                        else
                            delete message.networkLength;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return Ipv4Inet;
    })();

    common.Ipv6Inet = (function() {

        /**
         * Properties of an Ipv6Inet.
         * @typedef {Object} common.Ipv6Inet.$Properties
         * @property {common.Ipv6Addr.$Properties|null} [address] Ipv6Inet address
         * @property {number|null} [networkLength] Ipv6Inet networkLength
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an Ipv6Inet.
         * @memberof common
         * @interface IIpv6Inet
         * @augments common.Ipv6Inet.$Properties
         * @deprecated Use common.Ipv6Inet.$Properties instead.
         */

        /**
         * Shape of an Ipv6Inet.
         * @typedef {common.Ipv6Inet.$Properties} common.Ipv6Inet.$Shape
         */

        /**
         * Constructs a new Ipv6Inet.
         * @memberof common
         * @classdesc Represents an Ipv6Inet.
         * @constructor
         * @param {common.Ipv6Inet.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Ipv6Inet = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Ipv6Inet address.
         * @member {common.Ipv6Addr.$Properties|null|undefined} address
         * @memberof common.Ipv6Inet
         * @instance
         */
        Ipv6Inet.prototype.address = null;

        /**
         * Ipv6Inet networkLength.
         * @member {number} networkLength
         * @memberof common.Ipv6Inet
         * @instance
         */
        Ipv6Inet.prototype.networkLength = 0;

        /**
         * Encodes the specified Ipv6Inet message. Does not implicitly {@link common.Ipv6Inet.verify|verify} messages.
         * @function encode
         * @memberof common.Ipv6Inet
         * @static
         * @param {common.Ipv6Inet.$Properties} message Ipv6Inet message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Ipv6Inet.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.address != null && $Object.hasOwnProperty.call(message, "address"))
                $root.common.Ipv6Addr.encode(message.address, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.networkLength != null && $Object.hasOwnProperty.call(message, "networkLength") && message.networkLength !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.networkLength);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an Ipv6Inet message from the specified reader or buffer.
         * @function decode
         * @memberof common.Ipv6Inet
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.Ipv6Inet & common.Ipv6Inet.$Shape} Ipv6Inet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Ipv6Inet.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.Ipv6Inet(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.address = $root.common.Ipv6Addr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.address);
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.networkLength = value;
                        else
                            delete message.networkLength;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return Ipv6Inet;
    })();

    common.IpInet = (function() {

        /**
         * Properties of an IpInet.
         * @typedef {Object} common.IpInet.$Properties
         * @property {common.Ipv4Inet.$Properties|null} [ipv4] IpInet ipv4
         * @property {common.Ipv6Inet.$Properties|null} [ipv6] IpInet ipv6
         * @property {"ipv4"|"ipv6"} [ip] IpInet ip
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an IpInet.
         * @memberof common
         * @interface IIpInet
         * @augments common.IpInet.$Properties
         * @deprecated Use common.IpInet.$Properties instead.
         */

        /**
         * Narrowed shape of an IpInet.
         * @typedef {{
         *   ipv4?: common.Ipv4Inet.$Shape|null;
         *   ipv6?: common.Ipv6Inet.$Shape|null;
         *   $unknowns?: Array.<Uint8Array>;
         * } & (
         *   ({ ip?: undefined; ipv4?: null; ipv6?: null }|{ ip?: "ipv4"; ipv4: common.Ipv4Inet.$Shape; ipv6?: null }|{ ip?: "ipv6"; ipv4?: null; ipv6: common.Ipv6Inet.$Shape })
         * )} common.IpInet.$Shape
         */

        /**
         * Constructs a new IpInet.
         * @memberof common
         * @classdesc Represents an IpInet.
         * @constructor
         * @param {common.IpInet.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const IpInet = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * IpInet ipv4.
         * @member {common.Ipv4Inet.$Properties|null|undefined} ipv4
         * @memberof common.IpInet
         * @instance
         */
        IpInet.prototype.ipv4 = null;

        /**
         * IpInet ipv6.
         * @member {common.Ipv6Inet.$Properties|null|undefined} ipv6
         * @memberof common.IpInet
         * @instance
         */
        IpInet.prototype.ipv6 = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * IpInet ip.
         * @member {"ipv4"|"ipv6"|undefined} ip
         * @memberof common.IpInet
         * @instance
         */
        $Object.defineProperty(IpInet.prototype, "ip", {
            get: $util.oneOfGetter($oneOfFields = ["ipv4", "ipv6"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified IpInet message. Does not implicitly {@link common.IpInet.verify|verify} messages.
         * @function encode
         * @memberof common.IpInet
         * @static
         * @param {common.IpInet.$Properties} message IpInet message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IpInet.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.ipv4 != null && $Object.hasOwnProperty.call(message, "ipv4"))
                $root.common.Ipv4Inet.encode(message.ipv4, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.ipv6 != null && $Object.hasOwnProperty.call(message, "ipv6"))
                $root.common.Ipv6Inet.encode(message.ipv6, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an IpInet message from the specified reader or buffer.
         * @function decode
         * @memberof common.IpInet
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.IpInet & common.IpInet.$Shape} IpInet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IpInet.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.IpInet();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.ipv4 = $root.common.Ipv4Inet.decode(reader, reader.uint32(), $undefined, _depth + 1, message.ipv4);
                        message.ip = "ipv4";
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.ipv6 = $root.common.Ipv6Inet.decode(reader, reader.uint32(), $undefined, _depth + 1, message.ipv6);
                        message.ip = "ipv6";
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return IpInet;
    })();

    common.Url = (function() {

        /**
         * Properties of an Url.
         * @typedef {Object} common.Url.$Properties
         * @property {string|null} [url] Url url
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an Url.
         * @memberof common
         * @interface IUrl
         * @augments common.Url.$Properties
         * @deprecated Use common.Url.$Properties instead.
         */

        /**
         * Shape of an Url.
         * @typedef {common.Url.$Properties} common.Url.$Shape
         */

        /**
         * Constructs a new Url.
         * @memberof common
         * @classdesc Represents an Url.
         * @constructor
         * @param {common.Url.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Url = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Url url.
         * @member {string} url
         * @memberof common.Url
         * @instance
         */
        Url.prototype.url = "";

        /**
         * Encodes the specified Url message. Does not implicitly {@link common.Url.verify|verify} messages.
         * @function encode
         * @memberof common.Url
         * @static
         * @param {common.Url.$Properties} message Url message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Url.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.url != null && $Object.hasOwnProperty.call(message, "url") && message.url !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an Url message from the specified reader or buffer.
         * @function decode
         * @memberof common.Url
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.Url & common.Url.$Shape} Url
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Url.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.Url(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.url = value;
                        else
                            delete message.url;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return Url;
    })();

    common.SocketAddr = (function() {

        /**
         * Properties of a SocketAddr.
         * @typedef {Object} common.SocketAddr.$Properties
         * @property {common.Ipv4Addr.$Properties|null} [ipv4] SocketAddr ipv4
         * @property {common.Ipv6Addr.$Properties|null} [ipv6] SocketAddr ipv6
         * @property {number|null} [port] SocketAddr port
         * @property {"ipv4"|"ipv6"} [ip] SocketAddr ip
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a SocketAddr.
         * @memberof common
         * @interface ISocketAddr
         * @augments common.SocketAddr.$Properties
         * @deprecated Use common.SocketAddr.$Properties instead.
         */

        /**
         * Narrowed shape of a SocketAddr.
         * @typedef {{
         *   ipv4?: common.Ipv4Addr.$Shape|null;
         *   ipv6?: common.Ipv6Addr.$Shape|null;
         *   port?: number|null;
         *   $unknowns?: Array.<Uint8Array>;
         * } & (
         *   ({ ip?: undefined; ipv4?: null; ipv6?: null }|{ ip?: "ipv4"; ipv4: common.Ipv4Addr.$Shape; ipv6?: null }|{ ip?: "ipv6"; ipv4?: null; ipv6: common.Ipv6Addr.$Shape })
         * )} common.SocketAddr.$Shape
         */

        /**
         * Constructs a new SocketAddr.
         * @memberof common
         * @classdesc Represents a SocketAddr.
         * @constructor
         * @param {common.SocketAddr.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const SocketAddr = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * SocketAddr ipv4.
         * @member {common.Ipv4Addr.$Properties|null|undefined} ipv4
         * @memberof common.SocketAddr
         * @instance
         */
        SocketAddr.prototype.ipv4 = null;

        /**
         * SocketAddr ipv6.
         * @member {common.Ipv6Addr.$Properties|null|undefined} ipv6
         * @memberof common.SocketAddr
         * @instance
         */
        SocketAddr.prototype.ipv6 = null;

        /**
         * SocketAddr port.
         * @member {number} port
         * @memberof common.SocketAddr
         * @instance
         */
        SocketAddr.prototype.port = 0;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * SocketAddr ip.
         * @member {"ipv4"|"ipv6"|undefined} ip
         * @memberof common.SocketAddr
         * @instance
         */
        $Object.defineProperty(SocketAddr.prototype, "ip", {
            get: $util.oneOfGetter($oneOfFields = ["ipv4", "ipv6"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified SocketAddr message. Does not implicitly {@link common.SocketAddr.verify|verify} messages.
         * @function encode
         * @memberof common.SocketAddr
         * @static
         * @param {common.SocketAddr.$Properties} message SocketAddr message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SocketAddr.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.ipv4 != null && $Object.hasOwnProperty.call(message, "ipv4"))
                $root.common.Ipv4Addr.encode(message.ipv4, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.ipv6 != null && $Object.hasOwnProperty.call(message, "ipv6"))
                $root.common.Ipv6Addr.encode(message.ipv6, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.port != null && $Object.hasOwnProperty.call(message, "port") && message.port !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.port);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a SocketAddr message from the specified reader or buffer.
         * @function decode
         * @memberof common.SocketAddr
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.SocketAddr & common.SocketAddr.$Shape} SocketAddr
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SocketAddr.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.SocketAddr(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.ipv4 = $root.common.Ipv4Addr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.ipv4);
                        message.ip = "ipv4";
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.ipv6 = $root.common.Ipv6Addr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.ipv6);
                        message.ip = "ipv6";
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.port = value;
                        else
                            delete message.port;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return SocketAddr;
    })();

    common.TunnelInfo = (function() {

        /**
         * Properties of a TunnelInfo.
         * @typedef {Object} common.TunnelInfo.$Properties
         * @property {string|null} [tunnelType] TunnelInfo tunnelType
         * @property {common.Url.$Properties|null} [localAddr] TunnelInfo localAddr
         * @property {common.Url.$Properties|null} [remoteAddr] TunnelInfo remoteAddr
         * @property {common.Url.$Properties|null} [resolvedRemoteAddr] TunnelInfo resolvedRemoteAddr
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a TunnelInfo.
         * @memberof common
         * @interface ITunnelInfo
         * @augments common.TunnelInfo.$Properties
         * @deprecated Use common.TunnelInfo.$Properties instead.
         */

        /**
         * Shape of a TunnelInfo.
         * @typedef {common.TunnelInfo.$Properties} common.TunnelInfo.$Shape
         */

        /**
         * Constructs a new TunnelInfo.
         * @memberof common
         * @classdesc Represents a TunnelInfo.
         * @constructor
         * @param {common.TunnelInfo.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const TunnelInfo = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * TunnelInfo tunnelType.
         * @member {string} tunnelType
         * @memberof common.TunnelInfo
         * @instance
         */
        TunnelInfo.prototype.tunnelType = "";

        /**
         * TunnelInfo localAddr.
         * @member {common.Url.$Properties|null|undefined} localAddr
         * @memberof common.TunnelInfo
         * @instance
         */
        TunnelInfo.prototype.localAddr = null;

        /**
         * TunnelInfo remoteAddr.
         * @member {common.Url.$Properties|null|undefined} remoteAddr
         * @memberof common.TunnelInfo
         * @instance
         */
        TunnelInfo.prototype.remoteAddr = null;

        /**
         * TunnelInfo resolvedRemoteAddr.
         * @member {common.Url.$Properties|null|undefined} resolvedRemoteAddr
         * @memberof common.TunnelInfo
         * @instance
         */
        TunnelInfo.prototype.resolvedRemoteAddr = null;

        /**
         * Encodes the specified TunnelInfo message. Does not implicitly {@link common.TunnelInfo.verify|verify} messages.
         * @function encode
         * @memberof common.TunnelInfo
         * @static
         * @param {common.TunnelInfo.$Properties} message TunnelInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TunnelInfo.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.tunnelType != null && $Object.hasOwnProperty.call(message, "tunnelType") && message.tunnelType !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.tunnelType);
            if (message.localAddr != null && $Object.hasOwnProperty.call(message, "localAddr"))
                $root.common.Url.encode(message.localAddr, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.remoteAddr != null && $Object.hasOwnProperty.call(message, "remoteAddr"))
                $root.common.Url.encode(message.remoteAddr, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.resolvedRemoteAddr != null && $Object.hasOwnProperty.call(message, "resolvedRemoteAddr"))
                $root.common.Url.encode(message.resolvedRemoteAddr, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a TunnelInfo message from the specified reader or buffer.
         * @function decode
         * @memberof common.TunnelInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.TunnelInfo & common.TunnelInfo.$Shape} TunnelInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TunnelInfo.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.TunnelInfo(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.tunnelType = value;
                        else
                            delete message.tunnelType;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.localAddr = $root.common.Url.decode(reader, reader.uint32(), $undefined, _depth + 1, message.localAddr);
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.remoteAddr = $root.common.Url.decode(reader, reader.uint32(), $undefined, _depth + 1, message.remoteAddr);
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.resolvedRemoteAddr = $root.common.Url.decode(reader, reader.uint32(), $undefined, _depth + 1, message.resolvedRemoteAddr);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return TunnelInfo;
    })();

    common.StunInfo = (function() {

        /**
         * Properties of a StunInfo.
         * @typedef {Object} common.StunInfo.$Properties
         * @property {common.NatType|null} [udpNatType] StunInfo udpNatType
         * @property {common.NatType|null} [tcpNatType] StunInfo tcpNatType
         * @property {Long|null} [lastUpdateTime] StunInfo lastUpdateTime
         * @property {Array.<string>|null} [publicIp] StunInfo publicIp
         * @property {number|null} [minPort] StunInfo minPort
         * @property {number|null} [maxPort] StunInfo maxPort
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a StunInfo.
         * @memberof common
         * @interface IStunInfo
         * @augments common.StunInfo.$Properties
         * @deprecated Use common.StunInfo.$Properties instead.
         */

        /**
         * Shape of a StunInfo.
         * @typedef {common.StunInfo.$Properties} common.StunInfo.$Shape
         */

        /**
         * Constructs a new StunInfo.
         * @memberof common
         * @classdesc Represents a StunInfo.
         * @constructor
         * @param {common.StunInfo.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const StunInfo = function (properties) {
            this.publicIp = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * StunInfo udpNatType.
         * @member {common.NatType} udpNatType
         * @memberof common.StunInfo
         * @instance
         */
        StunInfo.prototype.udpNatType = 0;

        /**
         * StunInfo tcpNatType.
         * @member {common.NatType} tcpNatType
         * @memberof common.StunInfo
         * @instance
         */
        StunInfo.prototype.tcpNatType = 0;

        /**
         * StunInfo lastUpdateTime.
         * @member {Long} lastUpdateTime
         * @memberof common.StunInfo
         * @instance
         */
        StunInfo.prototype.lastUpdateTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * StunInfo publicIp.
         * @member {Array.<string>} publicIp
         * @memberof common.StunInfo
         * @instance
         */
        StunInfo.prototype.publicIp = $util.emptyArray;

        /**
         * StunInfo minPort.
         * @member {number} minPort
         * @memberof common.StunInfo
         * @instance
         */
        StunInfo.prototype.minPort = 0;

        /**
         * StunInfo maxPort.
         * @member {number} maxPort
         * @memberof common.StunInfo
         * @instance
         */
        StunInfo.prototype.maxPort = 0;

        /**
         * Encodes the specified StunInfo message. Does not implicitly {@link common.StunInfo.verify|verify} messages.
         * @function encode
         * @memberof common.StunInfo
         * @static
         * @param {common.StunInfo.$Properties} message StunInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StunInfo.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.udpNatType != null && $Object.hasOwnProperty.call(message, "udpNatType") && message.udpNatType !== 0)
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.udpNatType);
            if (message.tcpNatType != null && $Object.hasOwnProperty.call(message, "tcpNatType") && message.tcpNatType !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.tcpNatType);
            if (message.lastUpdateTime != null && $Object.hasOwnProperty.call(message, "lastUpdateTime") && (typeof message.lastUpdateTime === "object" ? message.lastUpdateTime.low || message.lastUpdateTime.high : message.lastUpdateTime !== 0))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.lastUpdateTime);
            if (message.publicIp != null && message.publicIp.length)
                for (let i = 0; i < message.publicIp.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.publicIp[i]);
            if (message.minPort != null && $Object.hasOwnProperty.call(message, "minPort") && message.minPort !== 0)
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.minPort);
            if (message.maxPort != null && $Object.hasOwnProperty.call(message, "maxPort") && message.maxPort !== 0)
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.maxPort);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a StunInfo message from the specified reader or buffer.
         * @function decode
         * @memberof common.StunInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.StunInfo & common.StunInfo.$Shape} StunInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StunInfo.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.StunInfo(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.udpNatType = value;
                        else
                            delete message.udpNatType;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.tcpNatType = value;
                        else
                            delete message.tcpNatType;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                            message.lastUpdateTime = value;
                        else
                            delete message.lastUpdateTime;
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        if (!(message.publicIp && message.publicIp.length))
                            message.publicIp = [];
                        message.publicIp.push(reader.stringVerify());
                        continue;
                    }
                case 5: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.minPort = value;
                        else
                            delete message.minPort;
                        continue;
                    }
                case 6: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.maxPort = value;
                        else
                            delete message.maxPort;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return StunInfo;
    })();

    common.PeerFeatureFlag = (function() {

        /**
         * Properties of a PeerFeatureFlag.
         * @typedef {Object} common.PeerFeatureFlag.$Properties
         * @property {boolean|null} [isPublicServer] PeerFeatureFlag isPublicServer
         * @property {boolean|null} [avoidRelayData] PeerFeatureFlag avoidRelayData
         * @property {boolean|null} [kcpInput] PeerFeatureFlag kcpInput
         * @property {boolean|null} [noRelayKcp] PeerFeatureFlag noRelayKcp
         * @property {boolean|null} [supportConnListSync] PeerFeatureFlag supportConnListSync
         * @property {boolean|null} [quicInput] PeerFeatureFlag quicInput
         * @property {boolean|null} [noRelayQuic] PeerFeatureFlag noRelayQuic
         * @property {boolean|null} [isCredentialPeer] PeerFeatureFlag isCredentialPeer
         * @property {boolean|null} [needP2p] PeerFeatureFlag needP2p
         * @property {boolean|null} [disableP2p] PeerFeatureFlag disableP2p
         * @property {boolean|null} [ipv6PublicAddrProvider] PeerFeatureFlag ipv6PublicAddrProvider
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a PeerFeatureFlag.
         * @memberof common
         * @interface IPeerFeatureFlag
         * @augments common.PeerFeatureFlag.$Properties
         * @deprecated Use common.PeerFeatureFlag.$Properties instead.
         */

        /**
         * Shape of a PeerFeatureFlag.
         * @typedef {common.PeerFeatureFlag.$Properties} common.PeerFeatureFlag.$Shape
         */

        /**
         * Constructs a new PeerFeatureFlag.
         * @memberof common
         * @classdesc Represents a PeerFeatureFlag.
         * @constructor
         * @param {common.PeerFeatureFlag.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const PeerFeatureFlag = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * PeerFeatureFlag isPublicServer.
         * @member {boolean} isPublicServer
         * @memberof common.PeerFeatureFlag
         * @instance
         */
        PeerFeatureFlag.prototype.isPublicServer = false;

        /**
         * PeerFeatureFlag avoidRelayData.
         * @member {boolean} avoidRelayData
         * @memberof common.PeerFeatureFlag
         * @instance
         */
        PeerFeatureFlag.prototype.avoidRelayData = false;

        /**
         * PeerFeatureFlag kcpInput.
         * @member {boolean} kcpInput
         * @memberof common.PeerFeatureFlag
         * @instance
         */
        PeerFeatureFlag.prototype.kcpInput = false;

        /**
         * PeerFeatureFlag noRelayKcp.
         * @member {boolean} noRelayKcp
         * @memberof common.PeerFeatureFlag
         * @instance
         */
        PeerFeatureFlag.prototype.noRelayKcp = false;

        /**
         * PeerFeatureFlag supportConnListSync.
         * @member {boolean} supportConnListSync
         * @memberof common.PeerFeatureFlag
         * @instance
         */
        PeerFeatureFlag.prototype.supportConnListSync = false;

        /**
         * PeerFeatureFlag quicInput.
         * @member {boolean} quicInput
         * @memberof common.PeerFeatureFlag
         * @instance
         */
        PeerFeatureFlag.prototype.quicInput = false;

        /**
         * PeerFeatureFlag noRelayQuic.
         * @member {boolean} noRelayQuic
         * @memberof common.PeerFeatureFlag
         * @instance
         */
        PeerFeatureFlag.prototype.noRelayQuic = false;

        /**
         * PeerFeatureFlag isCredentialPeer.
         * @member {boolean} isCredentialPeer
         * @memberof common.PeerFeatureFlag
         * @instance
         */
        PeerFeatureFlag.prototype.isCredentialPeer = false;

        /**
         * PeerFeatureFlag needP2p.
         * @member {boolean} needP2p
         * @memberof common.PeerFeatureFlag
         * @instance
         */
        PeerFeatureFlag.prototype.needP2p = false;

        /**
         * PeerFeatureFlag disableP2p.
         * @member {boolean} disableP2p
         * @memberof common.PeerFeatureFlag
         * @instance
         */
        PeerFeatureFlag.prototype.disableP2p = false;

        /**
         * PeerFeatureFlag ipv6PublicAddrProvider.
         * @member {boolean} ipv6PublicAddrProvider
         * @memberof common.PeerFeatureFlag
         * @instance
         */
        PeerFeatureFlag.prototype.ipv6PublicAddrProvider = false;

        /**
         * Encodes the specified PeerFeatureFlag message. Does not implicitly {@link common.PeerFeatureFlag.verify|verify} messages.
         * @function encode
         * @memberof common.PeerFeatureFlag
         * @static
         * @param {common.PeerFeatureFlag.$Properties} message PeerFeatureFlag message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PeerFeatureFlag.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.isPublicServer != null && $Object.hasOwnProperty.call(message, "isPublicServer") && message.isPublicServer !== false)
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isPublicServer);
            if (message.avoidRelayData != null && $Object.hasOwnProperty.call(message, "avoidRelayData") && message.avoidRelayData !== false)
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.avoidRelayData);
            if (message.kcpInput != null && $Object.hasOwnProperty.call(message, "kcpInput") && message.kcpInput !== false)
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.kcpInput);
            if (message.noRelayKcp != null && $Object.hasOwnProperty.call(message, "noRelayKcp") && message.noRelayKcp !== false)
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.noRelayKcp);
            if (message.supportConnListSync != null && $Object.hasOwnProperty.call(message, "supportConnListSync") && message.supportConnListSync !== false)
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.supportConnListSync);
            if (message.quicInput != null && $Object.hasOwnProperty.call(message, "quicInput") && message.quicInput !== false)
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.quicInput);
            if (message.noRelayQuic != null && $Object.hasOwnProperty.call(message, "noRelayQuic") && message.noRelayQuic !== false)
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.noRelayQuic);
            if (message.isCredentialPeer != null && $Object.hasOwnProperty.call(message, "isCredentialPeer") && message.isCredentialPeer !== false)
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.isCredentialPeer);
            if (message.needP2p != null && $Object.hasOwnProperty.call(message, "needP2p") && message.needP2p !== false)
                writer.uint32(/* id 9, wireType 0 =*/72).bool(message.needP2p);
            if (message.disableP2p != null && $Object.hasOwnProperty.call(message, "disableP2p") && message.disableP2p !== false)
                writer.uint32(/* id 10, wireType 0 =*/80).bool(message.disableP2p);
            if (message.ipv6PublicAddrProvider != null && $Object.hasOwnProperty.call(message, "ipv6PublicAddrProvider") && message.ipv6PublicAddrProvider !== false)
                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.ipv6PublicAddrProvider);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a PeerFeatureFlag message from the specified reader or buffer.
         * @function decode
         * @memberof common.PeerFeatureFlag
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.PeerFeatureFlag & common.PeerFeatureFlag.$Shape} PeerFeatureFlag
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PeerFeatureFlag.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.PeerFeatureFlag(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.isPublicServer = value;
                        else
                            delete message.isPublicServer;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.avoidRelayData = value;
                        else
                            delete message.avoidRelayData;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.kcpInput = value;
                        else
                            delete message.kcpInput;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.noRelayKcp = value;
                        else
                            delete message.noRelayKcp;
                        continue;
                    }
                case 5: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.supportConnListSync = value;
                        else
                            delete message.supportConnListSync;
                        continue;
                    }
                case 6: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.quicInput = value;
                        else
                            delete message.quicInput;
                        continue;
                    }
                case 7: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.noRelayQuic = value;
                        else
                            delete message.noRelayQuic;
                        continue;
                    }
                case 8: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.isCredentialPeer = value;
                        else
                            delete message.isCredentialPeer;
                        continue;
                    }
                case 9: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.needP2p = value;
                        else
                            delete message.needP2p;
                        continue;
                    }
                case 10: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.disableP2p = value;
                        else
                            delete message.disableP2p;
                        continue;
                    }
                case 11: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.ipv6PublicAddrProvider = value;
                        else
                            delete message.ipv6PublicAddrProvider;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return PeerFeatureFlag;
    })();

    /**
     * SocketType enum.
     * @name common.SocketType
     * @enum {number}
     * @property {number} TCP=0 TCP value
     * @property {number} UDP=1 UDP value
     */
    common.SocketType = (function() {
        const valuesById = $Object.create(null), values = $Object.create(valuesById);
        values[valuesById[0] = "TCP"] = 0;
        values[valuesById[1] = "UDP"] = 1;
        return values;
    })();

    common.PortForwardConfigPb = (function() {

        /**
         * Properties of a PortForwardConfigPb.
         * @typedef {Object} common.PortForwardConfigPb.$Properties
         * @property {common.SocketAddr.$Properties|null} [bindAddr] PortForwardConfigPb bindAddr
         * @property {common.SocketAddr.$Properties|null} [dstAddr] PortForwardConfigPb dstAddr
         * @property {common.SocketType|null} [socketType] PortForwardConfigPb socketType
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a PortForwardConfigPb.
         * @memberof common
         * @interface IPortForwardConfigPb
         * @augments common.PortForwardConfigPb.$Properties
         * @deprecated Use common.PortForwardConfigPb.$Properties instead.
         */

        /**
         * Shape of a PortForwardConfigPb.
         * @typedef {{
         *   bindAddr?: common.SocketAddr.$Shape|null;
         *   dstAddr?: common.SocketAddr.$Shape|null;
         *   socketType?: common.SocketType|null;
         *   $unknowns?: Array.<Uint8Array>;
         * }} common.PortForwardConfigPb.$Shape
         */

        /**
         * Constructs a new PortForwardConfigPb.
         * @memberof common
         * @classdesc Represents a PortForwardConfigPb.
         * @constructor
         * @param {common.PortForwardConfigPb.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const PortForwardConfigPb = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * PortForwardConfigPb bindAddr.
         * @member {common.SocketAddr.$Properties|null|undefined} bindAddr
         * @memberof common.PortForwardConfigPb
         * @instance
         */
        PortForwardConfigPb.prototype.bindAddr = null;

        /**
         * PortForwardConfigPb dstAddr.
         * @member {common.SocketAddr.$Properties|null|undefined} dstAddr
         * @memberof common.PortForwardConfigPb
         * @instance
         */
        PortForwardConfigPb.prototype.dstAddr = null;

        /**
         * PortForwardConfigPb socketType.
         * @member {common.SocketType} socketType
         * @memberof common.PortForwardConfigPb
         * @instance
         */
        PortForwardConfigPb.prototype.socketType = 0;

        /**
         * Encodes the specified PortForwardConfigPb message. Does not implicitly {@link common.PortForwardConfigPb.verify|verify} messages.
         * @function encode
         * @memberof common.PortForwardConfigPb
         * @static
         * @param {common.PortForwardConfigPb.$Properties} message PortForwardConfigPb message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PortForwardConfigPb.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.bindAddr != null && $Object.hasOwnProperty.call(message, "bindAddr"))
                $root.common.SocketAddr.encode(message.bindAddr, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.dstAddr != null && $Object.hasOwnProperty.call(message, "dstAddr"))
                $root.common.SocketAddr.encode(message.dstAddr, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.socketType != null && $Object.hasOwnProperty.call(message, "socketType") && message.socketType !== 0)
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.socketType);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a PortForwardConfigPb message from the specified reader or buffer.
         * @function decode
         * @memberof common.PortForwardConfigPb
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.PortForwardConfigPb & common.PortForwardConfigPb.$Shape} PortForwardConfigPb
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PortForwardConfigPb.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.PortForwardConfigPb(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.bindAddr = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.bindAddr);
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.dstAddr = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.dstAddr);
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.int32())
                            message.socketType = value;
                        else
                            delete message.socketType;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return PortForwardConfigPb;
    })();

    common.ProxyDstInfo = (function() {

        /**
         * Properties of a ProxyDstInfo.
         * @typedef {Object} common.ProxyDstInfo.$Properties
         * @property {common.SocketAddr.$Properties|null} [dstAddr] ProxyDstInfo dstAddr
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a ProxyDstInfo.
         * @memberof common
         * @interface IProxyDstInfo
         * @augments common.ProxyDstInfo.$Properties
         * @deprecated Use common.ProxyDstInfo.$Properties instead.
         */

        /**
         * Shape of a ProxyDstInfo.
         * @typedef {{
         *   dstAddr?: common.SocketAddr.$Shape|null;
         *   $unknowns?: Array.<Uint8Array>;
         * }} common.ProxyDstInfo.$Shape
         */

        /**
         * Constructs a new ProxyDstInfo.
         * @memberof common
         * @classdesc Represents a ProxyDstInfo.
         * @constructor
         * @param {common.ProxyDstInfo.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const ProxyDstInfo = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * ProxyDstInfo dstAddr.
         * @member {common.SocketAddr.$Properties|null|undefined} dstAddr
         * @memberof common.ProxyDstInfo
         * @instance
         */
        ProxyDstInfo.prototype.dstAddr = null;

        /**
         * Encodes the specified ProxyDstInfo message. Does not implicitly {@link common.ProxyDstInfo.verify|verify} messages.
         * @function encode
         * @memberof common.ProxyDstInfo
         * @static
         * @param {common.ProxyDstInfo.$Properties} message ProxyDstInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProxyDstInfo.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.dstAddr != null && $Object.hasOwnProperty.call(message, "dstAddr"))
                $root.common.SocketAddr.encode(message.dstAddr, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a ProxyDstInfo message from the specified reader or buffer.
         * @function decode
         * @memberof common.ProxyDstInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.ProxyDstInfo & common.ProxyDstInfo.$Shape} ProxyDstInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProxyDstInfo.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.ProxyDstInfo(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.dstAddr = $root.common.SocketAddr.decode(reader, reader.uint32(), $undefined, _depth + 1, message.dstAddr);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return ProxyDstInfo;
    })();

    common.SecureModeConfig = (function() {

        /**
         * Properties of a SecureModeConfig.
         * @typedef {Object} common.SecureModeConfig.$Properties
         * @property {boolean|null} [enabled] SecureModeConfig enabled
         * @property {string|null} [localPrivateKey] SecureModeConfig localPrivateKey
         * @property {string|null} [localPublicKey] SecureModeConfig localPublicKey
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a SecureModeConfig.
         * @memberof common
         * @interface ISecureModeConfig
         * @augments common.SecureModeConfig.$Properties
         * @deprecated Use common.SecureModeConfig.$Properties instead.
         */

        /**
         * Shape of a SecureModeConfig.
         * @typedef {common.SecureModeConfig.$Properties} common.SecureModeConfig.$Shape
         */

        /**
         * Constructs a new SecureModeConfig.
         * @memberof common
         * @classdesc Represents a SecureModeConfig.
         * @constructor
         * @param {common.SecureModeConfig.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const SecureModeConfig = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * SecureModeConfig enabled.
         * @member {boolean} enabled
         * @memberof common.SecureModeConfig
         * @instance
         */
        SecureModeConfig.prototype.enabled = false;

        /**
         * SecureModeConfig localPrivateKey.
         * @member {string|null|undefined} localPrivateKey
         * @memberof common.SecureModeConfig
         * @instance
         */
        SecureModeConfig.prototype.localPrivateKey = null;

        /**
         * SecureModeConfig localPublicKey.
         * @member {string|null|undefined} localPublicKey
         * @memberof common.SecureModeConfig
         * @instance
         */
        SecureModeConfig.prototype.localPublicKey = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(SecureModeConfig.prototype, "_localPrivateKey", {
            get: $util.oneOfGetter($oneOfFields = ["localPrivateKey"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        $Object.defineProperty(SecureModeConfig.prototype, "_localPublicKey", {
            get: $util.oneOfGetter($oneOfFields = ["localPublicKey"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified SecureModeConfig message. Does not implicitly {@link common.SecureModeConfig.verify|verify} messages.
         * @function encode
         * @memberof common.SecureModeConfig
         * @static
         * @param {common.SecureModeConfig.$Properties} message SecureModeConfig message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SecureModeConfig.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.enabled != null && $Object.hasOwnProperty.call(message, "enabled") && message.enabled !== false)
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.enabled);
            if (message.localPrivateKey != null && $Object.hasOwnProperty.call(message, "localPrivateKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.localPrivateKey);
            if (message.localPublicKey != null && $Object.hasOwnProperty.call(message, "localPublicKey"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.localPublicKey);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a SecureModeConfig message from the specified reader or buffer.
         * @function decode
         * @memberof common.SecureModeConfig
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.SecureModeConfig & common.SecureModeConfig.$Shape} SecureModeConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SecureModeConfig.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.common.SecureModeConfig(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.bool())
                            message.enabled = value;
                        else
                            delete message.enabled;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.localPrivateKey = reader.stringVerify();
                        message._localPrivateKey = "localPrivateKey";
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.localPublicKey = reader.stringVerify();
                        message._localPublicKey = "localPublicKey";
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return SecureModeConfig;
    })();

    return common;
})();

export const error = $root.error = (() => {

    /**
     * Namespace error.
     * @exports error
     * @namespace
     */
    const error = {};

    error.OtherError = (function() {

        /**
         * Properties of an OtherError.
         * @typedef {Object} error.OtherError.$Properties
         * @property {string|null} [errorMessage] OtherError errorMessage
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an OtherError.
         * @memberof error
         * @interface IOtherError
         * @augments error.OtherError.$Properties
         * @deprecated Use error.OtherError.$Properties instead.
         */

        /**
         * Shape of an OtherError.
         * @typedef {error.OtherError.$Properties} error.OtherError.$Shape
         */

        /**
         * Constructs a new OtherError.
         * @memberof error
         * @classdesc Represents an OtherError.
         * @constructor
         * @param {error.OtherError.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const OtherError = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * OtherError errorMessage.
         * @member {string} errorMessage
         * @memberof error.OtherError
         * @instance
         */
        OtherError.prototype.errorMessage = "";

        /**
         * Encodes the specified OtherError message. Does not implicitly {@link error.OtherError.verify|verify} messages.
         * @function encode
         * @memberof error.OtherError
         * @static
         * @param {error.OtherError.$Properties} message OtherError message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OtherError.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.errorMessage != null && $Object.hasOwnProperty.call(message, "errorMessage") && message.errorMessage !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.errorMessage);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an OtherError message from the specified reader or buffer.
         * @function decode
         * @memberof error.OtherError
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {error.OtherError & error.OtherError.$Shape} OtherError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OtherError.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.error.OtherError(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.errorMessage = value;
                        else
                            delete message.errorMessage;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return OtherError;
    })();

    error.InvalidMethodIndex = (function() {

        /**
         * Properties of an InvalidMethodIndex.
         * @typedef {Object} error.InvalidMethodIndex.$Properties
         * @property {string|null} [serviceName] InvalidMethodIndex serviceName
         * @property {number|null} [methodIndex] InvalidMethodIndex methodIndex
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an InvalidMethodIndex.
         * @memberof error
         * @interface IInvalidMethodIndex
         * @augments error.InvalidMethodIndex.$Properties
         * @deprecated Use error.InvalidMethodIndex.$Properties instead.
         */

        /**
         * Shape of an InvalidMethodIndex.
         * @typedef {error.InvalidMethodIndex.$Properties} error.InvalidMethodIndex.$Shape
         */

        /**
         * Constructs a new InvalidMethodIndex.
         * @memberof error
         * @classdesc Represents an InvalidMethodIndex.
         * @constructor
         * @param {error.InvalidMethodIndex.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const InvalidMethodIndex = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * InvalidMethodIndex serviceName.
         * @member {string} serviceName
         * @memberof error.InvalidMethodIndex
         * @instance
         */
        InvalidMethodIndex.prototype.serviceName = "";

        /**
         * InvalidMethodIndex methodIndex.
         * @member {number} methodIndex
         * @memberof error.InvalidMethodIndex
         * @instance
         */
        InvalidMethodIndex.prototype.methodIndex = 0;

        /**
         * Encodes the specified InvalidMethodIndex message. Does not implicitly {@link error.InvalidMethodIndex.verify|verify} messages.
         * @function encode
         * @memberof error.InvalidMethodIndex
         * @static
         * @param {error.InvalidMethodIndex.$Properties} message InvalidMethodIndex message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InvalidMethodIndex.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.serviceName != null && $Object.hasOwnProperty.call(message, "serviceName") && message.serviceName !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.serviceName);
            if (message.methodIndex != null && $Object.hasOwnProperty.call(message, "methodIndex") && message.methodIndex !== 0)
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.methodIndex);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an InvalidMethodIndex message from the specified reader or buffer.
         * @function decode
         * @memberof error.InvalidMethodIndex
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {error.InvalidMethodIndex & error.InvalidMethodIndex.$Shape} InvalidMethodIndex
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InvalidMethodIndex.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.error.InvalidMethodIndex(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.serviceName = value;
                        else
                            delete message.serviceName;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.methodIndex = value;
                        else
                            delete message.methodIndex;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return InvalidMethodIndex;
    })();

    error.InvalidService = (function() {

        /**
         * Properties of an InvalidService.
         * @typedef {Object} error.InvalidService.$Properties
         * @property {string|null} [serviceName] InvalidService serviceName
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an InvalidService.
         * @memberof error
         * @interface IInvalidService
         * @augments error.InvalidService.$Properties
         * @deprecated Use error.InvalidService.$Properties instead.
         */

        /**
         * Shape of an InvalidService.
         * @typedef {error.InvalidService.$Properties} error.InvalidService.$Shape
         */

        /**
         * Constructs a new InvalidService.
         * @memberof error
         * @classdesc Represents an InvalidService.
         * @constructor
         * @param {error.InvalidService.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const InvalidService = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * InvalidService serviceName.
         * @member {string} serviceName
         * @memberof error.InvalidService
         * @instance
         */
        InvalidService.prototype.serviceName = "";

        /**
         * Encodes the specified InvalidService message. Does not implicitly {@link error.InvalidService.verify|verify} messages.
         * @function encode
         * @memberof error.InvalidService
         * @static
         * @param {error.InvalidService.$Properties} message InvalidService message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InvalidService.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.serviceName != null && $Object.hasOwnProperty.call(message, "serviceName") && message.serviceName !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.serviceName);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an InvalidService message from the specified reader or buffer.
         * @function decode
         * @memberof error.InvalidService
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {error.InvalidService & error.InvalidService.$Shape} InvalidService
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InvalidService.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.error.InvalidService(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.serviceName = value;
                        else
                            delete message.serviceName;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return InvalidService;
    })();

    error.ProstDecodeError = (function() {

        /**
         * Properties of a ProstDecodeError.
         * @typedef {Object} error.ProstDecodeError.$Properties
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a ProstDecodeError.
         * @memberof error
         * @interface IProstDecodeError
         * @augments error.ProstDecodeError.$Properties
         * @deprecated Use error.ProstDecodeError.$Properties instead.
         */

        /**
         * Shape of a ProstDecodeError.
         * @typedef {error.ProstDecodeError.$Properties} error.ProstDecodeError.$Shape
         */

        /**
         * Constructs a new ProstDecodeError.
         * @memberof error
         * @classdesc Represents a ProstDecodeError.
         * @constructor
         * @param {error.ProstDecodeError.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const ProstDecodeError = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Encodes the specified ProstDecodeError message. Does not implicitly {@link error.ProstDecodeError.verify|verify} messages.
         * @function encode
         * @memberof error.ProstDecodeError
         * @static
         * @param {error.ProstDecodeError.$Properties} message ProstDecodeError message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProstDecodeError.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a ProstDecodeError message from the specified reader or buffer.
         * @function decode
         * @memberof error.ProstDecodeError
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {error.ProstDecodeError & error.ProstDecodeError.$Shape} ProstDecodeError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProstDecodeError.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.error.ProstDecodeError();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                reader.skipType(tag & 7, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return ProstDecodeError;
    })();

    error.ProstEncodeError = (function() {

        /**
         * Properties of a ProstEncodeError.
         * @typedef {Object} error.ProstEncodeError.$Properties
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a ProstEncodeError.
         * @memberof error
         * @interface IProstEncodeError
         * @augments error.ProstEncodeError.$Properties
         * @deprecated Use error.ProstEncodeError.$Properties instead.
         */

        /**
         * Shape of a ProstEncodeError.
         * @typedef {error.ProstEncodeError.$Properties} error.ProstEncodeError.$Shape
         */

        /**
         * Constructs a new ProstEncodeError.
         * @memberof error
         * @classdesc Represents a ProstEncodeError.
         * @constructor
         * @param {error.ProstEncodeError.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const ProstEncodeError = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Encodes the specified ProstEncodeError message. Does not implicitly {@link error.ProstEncodeError.verify|verify} messages.
         * @function encode
         * @memberof error.ProstEncodeError
         * @static
         * @param {error.ProstEncodeError.$Properties} message ProstEncodeError message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProstEncodeError.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a ProstEncodeError message from the specified reader or buffer.
         * @function decode
         * @memberof error.ProstEncodeError
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {error.ProstEncodeError & error.ProstEncodeError.$Shape} ProstEncodeError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProstEncodeError.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.error.ProstEncodeError();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                reader.skipType(tag & 7, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return ProstEncodeError;
    })();

    error.ExecuteError = (function() {

        /**
         * Properties of an ExecuteError.
         * @typedef {Object} error.ExecuteError.$Properties
         * @property {string|null} [errorMessage] ExecuteError errorMessage
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an ExecuteError.
         * @memberof error
         * @interface IExecuteError
         * @augments error.ExecuteError.$Properties
         * @deprecated Use error.ExecuteError.$Properties instead.
         */

        /**
         * Shape of an ExecuteError.
         * @typedef {error.ExecuteError.$Properties} error.ExecuteError.$Shape
         */

        /**
         * Constructs a new ExecuteError.
         * @memberof error
         * @classdesc Represents an ExecuteError.
         * @constructor
         * @param {error.ExecuteError.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const ExecuteError = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * ExecuteError errorMessage.
         * @member {string} errorMessage
         * @memberof error.ExecuteError
         * @instance
         */
        ExecuteError.prototype.errorMessage = "";

        /**
         * Encodes the specified ExecuteError message. Does not implicitly {@link error.ExecuteError.verify|verify} messages.
         * @function encode
         * @memberof error.ExecuteError
         * @static
         * @param {error.ExecuteError.$Properties} message ExecuteError message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExecuteError.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.errorMessage != null && $Object.hasOwnProperty.call(message, "errorMessage") && message.errorMessage !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.errorMessage);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an ExecuteError message from the specified reader or buffer.
         * @function decode
         * @memberof error.ExecuteError
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {error.ExecuteError & error.ExecuteError.$Shape} ExecuteError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExecuteError.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.error.ExecuteError(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.errorMessage = value;
                        else
                            delete message.errorMessage;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return ExecuteError;
    })();

    error.MalformatRpcPacket = (function() {

        /**
         * Properties of a MalformatRpcPacket.
         * @typedef {Object} error.MalformatRpcPacket.$Properties
         * @property {string|null} [errorMessage] MalformatRpcPacket errorMessage
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a MalformatRpcPacket.
         * @memberof error
         * @interface IMalformatRpcPacket
         * @augments error.MalformatRpcPacket.$Properties
         * @deprecated Use error.MalformatRpcPacket.$Properties instead.
         */

        /**
         * Shape of a MalformatRpcPacket.
         * @typedef {error.MalformatRpcPacket.$Properties} error.MalformatRpcPacket.$Shape
         */

        /**
         * Constructs a new MalformatRpcPacket.
         * @memberof error
         * @classdesc Represents a MalformatRpcPacket.
         * @constructor
         * @param {error.MalformatRpcPacket.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const MalformatRpcPacket = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * MalformatRpcPacket errorMessage.
         * @member {string} errorMessage
         * @memberof error.MalformatRpcPacket
         * @instance
         */
        MalformatRpcPacket.prototype.errorMessage = "";

        /**
         * Encodes the specified MalformatRpcPacket message. Does not implicitly {@link error.MalformatRpcPacket.verify|verify} messages.
         * @function encode
         * @memberof error.MalformatRpcPacket
         * @static
         * @param {error.MalformatRpcPacket.$Properties} message MalformatRpcPacket message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MalformatRpcPacket.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.errorMessage != null && $Object.hasOwnProperty.call(message, "errorMessage") && message.errorMessage !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.errorMessage);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a MalformatRpcPacket message from the specified reader or buffer.
         * @function decode
         * @memberof error.MalformatRpcPacket
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {error.MalformatRpcPacket & error.MalformatRpcPacket.$Shape} MalformatRpcPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MalformatRpcPacket.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.error.MalformatRpcPacket(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.errorMessage = value;
                        else
                            delete message.errorMessage;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return MalformatRpcPacket;
    })();

    error.Timeout = (function() {

        /**
         * Properties of a Timeout.
         * @typedef {Object} error.Timeout.$Properties
         * @property {string|null} [errorMessage] Timeout errorMessage
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a Timeout.
         * @memberof error
         * @interface ITimeout
         * @augments error.Timeout.$Properties
         * @deprecated Use error.Timeout.$Properties instead.
         */

        /**
         * Shape of a Timeout.
         * @typedef {error.Timeout.$Properties} error.Timeout.$Shape
         */

        /**
         * Constructs a new Timeout.
         * @memberof error
         * @classdesc Represents a Timeout.
         * @constructor
         * @param {error.Timeout.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Timeout = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Timeout errorMessage.
         * @member {string} errorMessage
         * @memberof error.Timeout
         * @instance
         */
        Timeout.prototype.errorMessage = "";

        /**
         * Encodes the specified Timeout message. Does not implicitly {@link error.Timeout.verify|verify} messages.
         * @function encode
         * @memberof error.Timeout
         * @static
         * @param {error.Timeout.$Properties} message Timeout message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Timeout.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.errorMessage != null && $Object.hasOwnProperty.call(message, "errorMessage") && message.errorMessage !== "")
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.errorMessage);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a Timeout message from the specified reader or buffer.
         * @function decode
         * @memberof error.Timeout
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {error.Timeout & error.Timeout.$Shape} Timeout
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Timeout.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.error.Timeout(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.errorMessage = value;
                        else
                            delete message.errorMessage;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return Timeout;
    })();

    error.Error = (function() {

        /**
         * Properties of an Error.
         * @typedef {Object} error.Error.$Properties
         * @property {error.OtherError.$Properties|null} [otherError] Error otherError
         * @property {error.InvalidMethodIndex.$Properties|null} [invalidMethodIndex] Error invalidMethodIndex
         * @property {error.InvalidService.$Properties|null} [invalidService] Error invalidService
         * @property {error.ProstDecodeError.$Properties|null} [prostDecodeError] Error prostDecodeError
         * @property {error.ProstEncodeError.$Properties|null} [prostEncodeError] Error prostEncodeError
         * @property {error.ExecuteError.$Properties|null} [executeError] Error executeError
         * @property {error.MalformatRpcPacket.$Properties|null} [malformatRpcPacket] Error malformatRpcPacket
         * @property {error.Timeout.$Properties|null} [timeout] Error timeout
         * @property {"otherError"|"invalidMethodIndex"|"invalidService"|"prostDecodeError"|"prostEncodeError"|"executeError"|"malformatRpcPacket"|"timeout"} [errorKind] Error errorKind
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an Error.
         * @memberof error
         * @interface IError
         * @augments error.Error.$Properties
         * @deprecated Use error.Error.$Properties instead.
         */

        /**
         * Narrowed shape of an Error.
         * @typedef {{
         *   otherError?: error.OtherError.$Shape|null;
         *   invalidMethodIndex?: error.InvalidMethodIndex.$Shape|null;
         *   invalidService?: error.InvalidService.$Shape|null;
         *   prostDecodeError?: error.ProstDecodeError.$Shape|null;
         *   prostEncodeError?: error.ProstEncodeError.$Shape|null;
         *   executeError?: error.ExecuteError.$Shape|null;
         *   malformatRpcPacket?: error.MalformatRpcPacket.$Shape|null;
         *   timeout?: error.Timeout.$Shape|null;
         *   $unknowns?: Array.<Uint8Array>;
         * } & (
         *   ({ errorKind?: undefined; otherError?: null; invalidMethodIndex?: null; invalidService?: null; prostDecodeError?: null; prostEncodeError?: null; executeError?: null; malformatRpcPacket?: null; timeout?: null }|{ errorKind?: "otherError"; otherError: error.OtherError.$Shape; invalidMethodIndex?: null; invalidService?: null; prostDecodeError?: null; prostEncodeError?: null; executeError?: null; malformatRpcPacket?: null; timeout?: null }|{ errorKind?: "invalidMethodIndex"; otherError?: null; invalidMethodIndex: error.InvalidMethodIndex.$Shape; invalidService?: null; prostDecodeError?: null; prostEncodeError?: null; executeError?: null; malformatRpcPacket?: null; timeout?: null }|{ errorKind?: "invalidService"; otherError?: null; invalidMethodIndex?: null; invalidService: error.InvalidService.$Shape; prostDecodeError?: null; prostEncodeError?: null; executeError?: null; malformatRpcPacket?: null; timeout?: null }|{ errorKind?: "prostDecodeError"; otherError?: null; invalidMethodIndex?: null; invalidService?: null; prostDecodeError: error.ProstDecodeError.$Shape; prostEncodeError?: null; executeError?: null; malformatRpcPacket?: null; timeout?: null }|{ errorKind?: "prostEncodeError"; otherError?: null; invalidMethodIndex?: null; invalidService?: null; prostDecodeError?: null; prostEncodeError: error.ProstEncodeError.$Shape; executeError?: null; malformatRpcPacket?: null; timeout?: null }|{ errorKind?: "executeError"; otherError?: null; invalidMethodIndex?: null; invalidService?: null; prostDecodeError?: null; prostEncodeError?: null; executeError: error.ExecuteError.$Shape; malformatRpcPacket?: null; timeout?: null }|{ errorKind?: "malformatRpcPacket"; otherError?: null; invalidMethodIndex?: null; invalidService?: null; prostDecodeError?: null; prostEncodeError?: null; executeError?: null; malformatRpcPacket: error.MalformatRpcPacket.$Shape; timeout?: null }|{ errorKind?: "timeout"; otherError?: null; invalidMethodIndex?: null; invalidService?: null; prostDecodeError?: null; prostEncodeError?: null; executeError?: null; malformatRpcPacket?: null; timeout: error.Timeout.$Shape })
         * )} error.Error.$Shape
         */

        /**
         * Constructs a new Error.
         * @memberof error
         * @classdesc Represents an Error.
         * @constructor
         * @param {error.Error.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const Error = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * Error otherError.
         * @member {error.OtherError.$Properties|null|undefined} otherError
         * @memberof error.Error
         * @instance
         */
        Error.prototype.otherError = null;

        /**
         * Error invalidMethodIndex.
         * @member {error.InvalidMethodIndex.$Properties|null|undefined} invalidMethodIndex
         * @memberof error.Error
         * @instance
         */
        Error.prototype.invalidMethodIndex = null;

        /**
         * Error invalidService.
         * @member {error.InvalidService.$Properties|null|undefined} invalidService
         * @memberof error.Error
         * @instance
         */
        Error.prototype.invalidService = null;

        /**
         * Error prostDecodeError.
         * @member {error.ProstDecodeError.$Properties|null|undefined} prostDecodeError
         * @memberof error.Error
         * @instance
         */
        Error.prototype.prostDecodeError = null;

        /**
         * Error prostEncodeError.
         * @member {error.ProstEncodeError.$Properties|null|undefined} prostEncodeError
         * @memberof error.Error
         * @instance
         */
        Error.prototype.prostEncodeError = null;

        /**
         * Error executeError.
         * @member {error.ExecuteError.$Properties|null|undefined} executeError
         * @memberof error.Error
         * @instance
         */
        Error.prototype.executeError = null;

        /**
         * Error malformatRpcPacket.
         * @member {error.MalformatRpcPacket.$Properties|null|undefined} malformatRpcPacket
         * @memberof error.Error
         * @instance
         */
        Error.prototype.malformatRpcPacket = null;

        /**
         * Error timeout.
         * @member {error.Timeout.$Properties|null|undefined} timeout
         * @memberof error.Error
         * @instance
         */
        Error.prototype.timeout = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * Error errorKind.
         * @member {"otherError"|"invalidMethodIndex"|"invalidService"|"prostDecodeError"|"prostEncodeError"|"executeError"|"malformatRpcPacket"|"timeout"|undefined} errorKind
         * @memberof error.Error
         * @instance
         */
        $Object.defineProperty(Error.prototype, "errorKind", {
            get: $util.oneOfGetter($oneOfFields = ["otherError", "invalidMethodIndex", "invalidService", "prostDecodeError", "prostEncodeError", "executeError", "malformatRpcPacket", "timeout"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Encodes the specified Error message. Does not implicitly {@link error.Error.verify|verify} messages.
         * @function encode
         * @memberof error.Error
         * @static
         * @param {error.Error.$Properties} message Error message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Error.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.otherError != null && $Object.hasOwnProperty.call(message, "otherError"))
                $root.error.OtherError.encode(message.otherError, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
            if (message.invalidMethodIndex != null && $Object.hasOwnProperty.call(message, "invalidMethodIndex"))
                $root.error.InvalidMethodIndex.encode(message.invalidMethodIndex, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.invalidService != null && $Object.hasOwnProperty.call(message, "invalidService"))
                $root.error.InvalidService.encode(message.invalidService, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.prostDecodeError != null && $Object.hasOwnProperty.call(message, "prostDecodeError"))
                $root.error.ProstDecodeError.encode(message.prostDecodeError, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
            if (message.prostEncodeError != null && $Object.hasOwnProperty.call(message, "prostEncodeError"))
                $root.error.ProstEncodeError.encode(message.prostEncodeError, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
            if (message.executeError != null && $Object.hasOwnProperty.call(message, "executeError"))
                $root.error.ExecuteError.encode(message.executeError, writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
            if (message.malformatRpcPacket != null && $Object.hasOwnProperty.call(message, "malformatRpcPacket"))
                $root.error.MalformatRpcPacket.encode(message.malformatRpcPacket, writer.uint32(/* id 7, wireType 2 =*/58).fork(), _depth + 1).ldelim();
            if (message.timeout != null && $Object.hasOwnProperty.call(message, "timeout"))
                $root.error.Timeout.encode(message.timeout, writer.uint32(/* id 8, wireType 2 =*/66).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an Error message from the specified reader or buffer.
         * @function decode
         * @memberof error.Error
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {error.Error & error.Error.$Shape} Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Error.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.error.Error();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.otherError = $root.error.OtherError.decode(reader, reader.uint32(), $undefined, _depth + 1, message.otherError);
                        message.errorKind = "otherError";
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.invalidMethodIndex = $root.error.InvalidMethodIndex.decode(reader, reader.uint32(), $undefined, _depth + 1, message.invalidMethodIndex);
                        message.errorKind = "invalidMethodIndex";
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.invalidService = $root.error.InvalidService.decode(reader, reader.uint32(), $undefined, _depth + 1, message.invalidService);
                        message.errorKind = "invalidService";
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.prostDecodeError = $root.error.ProstDecodeError.decode(reader, reader.uint32(), $undefined, _depth + 1, message.prostDecodeError);
                        message.errorKind = "prostDecodeError";
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        message.prostEncodeError = $root.error.ProstEncodeError.decode(reader, reader.uint32(), $undefined, _depth + 1, message.prostEncodeError);
                        message.errorKind = "prostEncodeError";
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        message.executeError = $root.error.ExecuteError.decode(reader, reader.uint32(), $undefined, _depth + 1, message.executeError);
                        message.errorKind = "executeError";
                        continue;
                    }
                case 7: {
                        if (wireType !== 2)
                            break;
                        message.malformatRpcPacket = $root.error.MalformatRpcPacket.decode(reader, reader.uint32(), $undefined, _depth + 1, message.malformatRpcPacket);
                        message.errorKind = "malformatRpcPacket";
                        continue;
                    }
                case 8: {
                        if (wireType !== 2)
                            break;
                        message.timeout = $root.error.Timeout.decode(reader, reader.uint32(), $undefined, _depth + 1, message.timeout);
                        message.errorKind = "timeout";
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        return Error;
    })();

    return error;
})();

export {
  $root as default
};
